import { BaseMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

import {
  CreateOrderExtractionType,
  CreateOrderOutputSchema,
  ProductComparisonOutputSchema,
  ProductSearchOutputSchema,
} from '@app/models';
import { CreateOrderTool } from '@app/tools/create-order.tool';
import OrderService from '@app/services/order.service';
import UserService from '@app/services/user.service';
import ProductService from '@app/services/product.service';

import { AgentFactory } from './agent.factory';
import { AgentExecutionResult, AgentState, GeminiServiceError, AgentWithInvoke } from '@app/types/agent.types';

export class AgentManager {
  private agentsMap: Record<string, AgentWithInvoke> = {};
  private readonly _agentFactory: AgentFactory;
  private readonly _genai_1_5_structured_output: ChatGoogleGenerativeAI;

  constructor(agentFactory: AgentFactory, genai1_5: ChatGoogleGenerativeAI) {
    this._agentFactory = agentFactory;
    this._genai_1_5_structured_output = genai1_5;
    this.initializeAgents();
  }

  private async initializeAgents() {
    this.agentsMap = {
      Supervisor: await this._agentFactory.createSupervisorAgent(),
      ProductSearch: this._agentFactory.createProductSearchAgent(),
      ProductComparison: this._agentFactory.createProductComparisonAgent(),
      Communicate: this._agentFactory.createCommunicateAgent(),
      CreateOrderExtractor: this._agentFactory.createCreateOrderInfoExtractorAgent(), 
    };
  }

  private validateNextAgent(next: string) {
    if (!Object.keys(this.agentsMap).includes(next)) {
      throw new Error(`Invalid next agent: ${next}`);
    }
  }

  public async executeAgent(state: AgentState): Promise<AgentExecutionResult> {
    const { next } = state;

    if (next === 'Communicate') {
      const comms_input = {
        messages: state.messages,
        agent_history: state.agent_history,
        agent_scratchpad: [],
      };
      const response = await this.agentsMap['Communicate'].invoke(comms_input);
      console.log('Communicate LLM raw output:', response);
      return { isFinal: true, 
        data: {
          content: response.output,
          tool: 'communicate',
        }
      };
    }

    if (next === 'Supervisor') {
      const supervisor_input = {
        messages: state.messages.filter((msg) => {
          const content = msg.content;
          return typeof content === 'string' && content.trim() !== '';
        }),
        agent_history: state.agent_history.filter((msg) => {
          const content = msg.content;
          return typeof content === 'string' && content.trim() !== '';
        }),
      };

      if (supervisor_input.messages.length === 0) {
        throw new GeminiServiceError('No valid messages found in input', 'INVALID_INPUT');
      }

      try {
        const supervisor_result_raw = await this.agentsMap['Supervisor'].invoke(supervisor_input);
        const supervisor_result = JSON.parse(supervisor_result_raw.output);
        console.log('Supervisor LLM raw output:', supervisor_result);

        this.validateNextAgent(supervisor_result.next);
        return { isFinal: false, newState: { ...state, next: supervisor_result.next } };
      } catch (error) {
        console.error('Error in supervisor agent:', error);
        throw new GeminiServiceError(
          error instanceof Error ? error.message : 'Unknown error in supervisor agent',
          'SUPERVISOR_ERROR'
        );
      }
    }

    if (next === 'ProductSearch') {
      const product_search_input = {
        messages: state.messages,
        agent_history: state.agent_history,
      };
      try {
        const product_search_result = await this.agentsMap['ProductSearch'].invoke(product_search_input);
        console.log('ProductSearch LLM raw output:', product_search_result);

        const parsingPrompt = `
          Dưới đây là kết quả trả về từ LLM cho một truy vấn tìm kiếm sản phẩm.
          Nhiệm vụ của bạn là chỉ PARSE dữ liệu theo đúng schema đã cho, KHÔNG tạo nội dung mới.

          Kết quả cần parse:
          ${product_search_result.output}
          `;

        const product_search_result_json = await this._genai_1_5_structured_output
          .withStructuredOutput(ProductSearchOutputSchema)
          .invoke(parsingPrompt);

        

        return { isFinal: true, data: {
            content: JSON.stringify(product_search_result_json),
            tool: 'product_search',
        } };
      } catch (error) {
        throw new GeminiServiceError(
          'Dịch vụ AI hiện đang quá tải, vui lòng thử lại sau vài phút.',
          'AI_SERVICE_UNAVAILABLE'
        );
      }
    }

    if (next === 'ProductComparison') {
      const product_comparison_input = {
        messages: state.messages,
        agent_history: state.agent_history,
      };

      try {
        const product_comparison_result = await this.agentsMap['ProductComparison'].invoke(product_comparison_input);
        console.log('ProductComparison LLM raw output:', product_comparison_result);

        const parsingPrompt = `
          Dưới đây là kết quả trả về từ LLM cho một truy vấn so sánh sản phẩm.
          Nhiệm vụ của bạn là chỉ PARSE dữ liệu theo đúng schema đã cho, KHÔNG tạo nội dung mới.

          Kết quả cần parse:
          ${product_comparison_result.output}
          `;

        const product_comparison_result_json = await this._genai_1_5_structured_output
          .withStructuredOutput(ProductComparisonOutputSchema)
          .invoke(parsingPrompt);

        return { isFinal: true, data: {
            content: JSON.stringify(product_comparison_result_json),
            tool: 'product_comparison',
        } };
      } catch (error) {
        throw new GeminiServiceError(
          'Dịch vụ AI hiện đang quá tải, vui lòng thử lại sau vài phút.',
          'AI_SERVICE_UNAVAILABLE'
        );
      }
    }

    if (next === 'CreateOrderExtractor') {
      const create_order_input = {
        messages: state.messages,
        agent_history: state.agent_history,
      };

      const extraction_result_raw = await this.agentsMap['CreateOrderExtractor'].invoke(create_order_input);
      console.log('CreateOrderExtraction LLM raw output:', extraction_result_raw);

      let extractedData: CreateOrderExtractionType;

      try {
        extractedData = JSON.parse(extraction_result_raw.output);
        for (let key in extractedData) {
          if (extractedData[key] === 'null' ) {
            extractedData[key] = undefined;
          }
        }
      } catch (error) {
        console.error('Failed to parse CreateOrder Extractor output as JSON:', error);
        throw new GeminiServiceError(
          'AI phản hồi dữ liệu không hợp lệ. Vui lòng thử lại sau.',
          'INVALID_AI_RESPONSE'
        );
      }

      const requiredFields: (keyof CreateOrderExtractionType)[] = [
        'address',
        'fullname',
        'phoneNumber',
        'productName',
        'count',
      ];
      const allFieldsPresent = requiredFields.every((field) => extractedData[field] !== undefined);

      let finalResponseData: z.infer<typeof CreateOrderOutputSchema>;

      if (allFieldsPresent) {
        const orderInput = {
          address: extractedData.address!,
          fullname: extractedData.fullname!,
          phoneNumber: extractedData.phoneNumber!,
          productName: extractedData.productName!,
          count: extractedData.count!,
          note: extractedData.note || '',
          userId: (this._agentFactory as AgentFactory).userId,
        };

        const createOrderTool = new CreateOrderTool(
          new OrderService(),
          new UserService(),
          new ProductService(),
          orderInput.userId
        );

        try {
            
          const toolResultString = await createOrderTool._call(orderInput);
          const toolResultJson = JSON.parse(toolResultString);

          finalResponseData = {
            answer: toolResultJson.success
              ? 'Đơn hàng của bạn đã được tạo thành công!'
              : toolResultJson.message || 'Đã có lỗi xảy ra khi tạo đơn hàng.',
            orderResult: {
              success: toolResultJson.success,
              paymentIntent: toolResultJson.success ? toolResultJson.paymentIntent : null,
            },
          };
        } catch (error: any) {
          console.error('Error during forced CreateOrderTool call:', error);
          finalResponseData = {
            answer: `Đã có lỗi xảy ra khi xử lý đơn hàng: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`,
            orderResult: { success: false, paymentIntent: null },
          };
        }
      } else {
        finalResponseData = {
          answer: extractedData.user_response || 'Vui lòng cung cấp đầy đủ thông tin để tạo đơn hàng.',
          orderResult: { success: false, paymentIntent: null },
        };
      }

      return { isFinal: true, data: {
        content: JSON.stringify(finalResponseData),
        tool: 'create_order',
      } };
    }

    throw new Error(`Unhandled agent state: ${next}`);
  }
}