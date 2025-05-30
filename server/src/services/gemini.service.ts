import { readFileSync } from 'fs';

import { HumanMessage, BaseMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChainValues } from '@langchain/core/utils/types';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

import { geminiApiKey, geminiModel } from '@config';
import { RoleEnum } from 'generated/prisma';

import app from '@app/app';
import {
  CreateOrderErrorResponseSchema,
  CreateOrderSuccessResponseSchema,
  GeminiResponseData,
  GeneralMessageResponseSchema,
  ProductComparisonResponseSchema,
  ProductSearchErrorResponseSchema,
  ProductSearchResponseSchema,
  ResultType,
} from '@app/models';
import ChatRepository from '@app/repositories/chat.repository';
import { CreateOrderTool } from '@app/tools/create-order.tool';
import { ProductComparisonTool } from '@app/tools/product-comparison.tool';
import { ProductSearchTool } from '@app/tools/product-seach.tool';

import OrderService from './order.service';
import ProductService from './product.service';
import UserService from './user.service';
import { JsonOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { Runnable, RunnableLambda, RunnableSequence } from '@langchain/core/runnables';

interface AgentInvokeResult {
  output: string;
  intermediateSteps: any[];
}

interface AgentWithInvoke {
  invoke: (input: any) => Promise<AgentInvokeResult>;
}

export class GeminiServiceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export default class GeminiService {
  private readonly _genai: ChatGoogleGenerativeAI;
  private readonly _chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    if (!geminiApiKey) {
      throw new GeminiServiceError('Gemini API key is not configured', 'CONFIG_ERROR');
    }

    this._genai = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: geminiModel,
      temperature: 0,
    });

    this._chatRepository = chatRepository;
  }

  async loadChatHistory(sessionId: string): Promise<BaseMessage[]> {
    const messagesFromDB = await this._chatRepository.getChatMessagesBySessionId(sessionId, 20, 0, 'asc');
    const messages = messagesFromDB.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return messages.map((message) => {
      if (message.role === RoleEnum.User) {
        return new HumanMessage(message.content);
      }
      return new AIMessage(message.content);
    });
  }

  // Code cũ -> Agent Hỗn hơp
  async generateResponse(
    query: string,
    sessionId: string,
    userId: string | null
  ): Promise<ResultType<{ content: GeminiResponseData; tool: string; aiMessage: string }>> {
    try {
      const chatHistory = await this.loadChatHistory(sessionId);
      const systemPrompt = readFileSync('src/config/sys_prompt_main.txt', 'utf-8');
      app.log.info('System prompt:', systemPrompt);

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        new MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
        new MessagesPlaceholder('agent_scratchpad'),
      ]);

      const tools = [
        new ProductSearchTool(new ProductService()),
        new ProductComparisonTool(new ProductService()),
        new CreateOrderTool(new OrderService(), new UserService(), new ProductService(), userId),
      ];

      const agent = createToolCallingAgent({
        llm: this._genai,
        tools,
        prompt,
      });

      const agentExecutor = AgentExecutor.fromAgentAndTools({
        agent,
        tools,
        verbose: true,
        maxIterations: 3,
        returnIntermediateSteps: true,
      });

      let result: ChainValues = await agentExecutor.invoke({
        input: query,
        chat_history: chatHistory,
      });

      // app.log.info('Agent result:', result.output as string);
      // app.log.info('Intermediate steps:', result.intermediateSteps);

      let hasToolCall = result.intermediateSteps && result.intermediateSteps.length > 0;
      let aiMessage = '';
      let toolName = '';

      let response: GeminiResponseData = {};
      if (!hasToolCall) {
        const forceToolPrompt = `WARNING: Bạn vưà không sử dụng tool nào cả cho yêu cầu "${query}". Nếu câu hỏi cần lấy hoặc tạo dữ liệu hãy thực hiện lại và sử dụng 1 trong 3 tool sau: product_search, product_comparison, create_order. Để có kết quả phản hồi tốt nhất.`;

        result = await agentExecutor.invoke({
          input: forceToolPrompt,
          chat_history: chatHistory,
        });

        hasToolCall = result.intermediateSteps && result.intermediateSteps.length > 0;
      }

      if (hasToolCall) {
        const jsonResult = this.extractJSON(result.output as string);
        const tool = result.intermediateSteps[0].action.tool;
        if (tool === 'product_search') {
          aiMessage = result.output as string;
          toolName = 'product_search';

          response = ProductSearchResponseSchema.safeParse(jsonResult).success
            ? ProductSearchResponseSchema.parse(jsonResult)
            : ProductSearchErrorResponseSchema.parse(jsonResult);
        } else if (tool === 'product_comparison') {
          aiMessage = result.output as string;
          toolName = 'product_comparison';

          response = ProductComparisonResponseSchema.parse(jsonResult);
        } else if (tool === 'create_order') {
          aiMessage = result.output as string;
          toolName = 'create_order';

          response = CreateOrderSuccessResponseSchema.safeParse(jsonResult).success
            ? CreateOrderSuccessResponseSchema.parse(jsonResult)
            : CreateOrderErrorResponseSchema.parse(jsonResult);
        }
      } else {
        const jsonResult = this.extractJSON(result.output as string);
        aiMessage = result.output as string;
        toolName = 'general_message';

        response = GeneralMessageResponseSchema.parse(jsonResult);
      }

      // const response = result.output as string;

      if (!response) {
        throw new GeminiServiceError('Empty response from Gemini API', 'EMPTY_RESPONSE');
      }

      return {
        code: 200,
        success: true,
        message: 'Success',
        data: { content: response, tool: toolName, aiMessage },
      };
    } catch (error) {
      app.log.error('Error in generateResponse:', error);
      return {
        code: 500,
        success: false,
        message: 'Internal server error',
        data: null,
      };
    }
  }

  // Code mới -> Multi Agent
  async generateResponseWithAgent(
    query: string,
    sessionId: string,
    userId: string | null
  ): Promise<ResultType<string>> {
    const search_product_agent: AgentWithInvoke = this.create_search_product_agent();
    const product_comparison_agent: AgentWithInvoke = this.create_product_comparison_agent();
    const create_order_agent: AgentWithInvoke = this.create_create_order_agent(userId);
    const generate_response_agent: AgentWithInvoke = this.create_generate_response_agent();
    const supervisor_chain = this.supervisor_agent(this._genai);

    const chatHistory = await this.loadChatHistory(sessionId);

    const userMessage: HumanMessage = new HumanMessage({ content: query });

    let state = {
      messages: [userMessage],
      agent_history: [...chatHistory],
      next: 'Supervisor',
    };

    const agentsMap: Record<string, any> = {
      Supervisor: supervisor_chain,
      ProductSearch: search_product_agent,
      ProductComparison: product_comparison_agent,
      CreateOrder: create_order_agent,
      Communicate: generate_response_agent,
    };

    const validateNextAgent = (next: string) => {
      if (!Object.keys(agentsMap).includes(next)) {
        throw new Error(`Invalid next agent: ${next}`);
      }
    };

    let iteration = 0;
    const maxIteration = 10;

    while (iteration < maxIteration) {
      iteration++;

      if (state.next === 'Communicate') {
        const comms_input = {
          messages: state.messages,
          agent_history: state.agent_history,
          agent_scratchpad: [],
        };
        const response = await agentsMap['Communicate'].invoke(comms_input);
        console.log('Communicate LLM raw output:', response);
        return {
          code: 200,
          success: true,
          message: 'Success',
          data: response.output,
        };
      }

      if (state.next === 'Supervisor') {
        const supervisor_input = {
          messages: state.messages,
          agent_history: state.agent_history,
        };
        const supervisor_result = await (await supervisor_chain).invoke(supervisor_input);
        console.log('Supervisor LLM raw output:', supervisor_result);

        validateNextAgent(supervisor_result.next);
        state.next = supervisor_result.next;
        continue;
      }

      const current_agent = agentsMap[state.next];
      const current_agent_input = {
        messages: [state.messages[state.messages.length - 1]],
        agent_history: state.agent_history,
        agent_scratchpad: [],
      };

      const agent_result = await current_agent.invoke(current_agent_input);
      // const aiMsg = new AIMessage({
      //   content: agent_result.output,
      //   additional_kwargs: {
      //     intermediate_steps: agent_result.intermediateSteps,
      //     name: state.next,
      //   },
      // });

      return {
        code: 200,
        success: true,
        message: 'Success',
        data: agent_result.output,
      };

    }

    return {
      code: 500,
      success: false,
      message: 'Sorry, something went wrong while processing your request.',
      data: null,
    };
  }

  private async supervisor_agent(llm: ChatGoogleGenerativeAI) {
    enum members {
      ProductSearch = 'ProductSearch',
      ProductComparison = 'ProductComparison',
      CreateOrder = 'CreateOrder',
      Communicate = 'Communicate',
    }

    const SupervisorOutputSchema = z.object({
      next: z.nativeEnum(members).default(members.Communicate),
    });

    const sys_prompt_main = `You are an intelligent supervisor managing a team of specialized agents: {members}. 
  Your job is to analyze the user's request and conversation history to determine which agent should handle the next task.
  
  AGENT CAPABILITIES:
  - ProductSearch: Search for products based on criteria (name, category, price range, features)
  - ProductComparison: Compare multiple products side-by-side 
  - CreateOrder: Create orders for products (requires user authentication)
  - Communicate: Generate final response to user with gathered information
  
  DECISION LOGIC:
  1. If user asks to search/find products/product details (like price, features, etc) → ProductSearch
  2. If user wants to compare products (and we have product data) → ProductComparison  
  3. If user wants to buy/order something (and we have product info) → CreateOrder
  4. If user provide imformation like phone number, address, name, email, etc → CreateOrder
  5. If we have completed all necessary tasks, other → Communicate
  6. If you don't know what to do, → Communicate
  
  ANALYSIS GUIDELINES:
  - Look at the latest user message to understand their intent
  - Check agent_history to see what tasks have been completed
  - Don't repeat the same agent type consecutively unless needed
  - Always end with Communicate to provide final response
  
  Based on the above, determine the next agent from: {options}
  
  {format_instructions}`;

    const format_instructions = `
  Format your response strictly as a JSON object like this:
  {
    "next": "ProductSearch" | "ProductComparison" | "CreateOrder" | "Communicate"
  }
  Do not include any explanation or preamble.
    `;

    const output_parser = new StructuredOutputParser(SupervisorOutputSchema);

    const prompt = await ChatPromptTemplate.fromMessages([
      ['system', sys_prompt_main],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_history'),
    ]).partial({
      members: Object.values(members).join(', '),
      options: Object.values(members).join(' | '),
      format_instructions: format_instructions,
    });

    // const parser = new RunnableLambda({
    //   func: async (response: any) => {
    //     let raw = response?.content ?? response?.[0]?.text ?? '';
    //     console.log('🔍 Supervisor raw LLM output:', raw);

    //     // Clean markdown block
    //     raw = raw.trim();
    //     if (raw.startsWith('```')) {
    //       raw = raw.replace(/```json|```/g, '').trim();
    //     }

    //     try {
    //       const json = JSON.parse(raw);
    //       const result = SupervisorOutputSchema.safeParse(json);
    //       if (!result.success) {
    //         console.error('❌ Zod validation failed:', result.error);
    //         // Fallback logic based on content analysis
    //         const content = raw.toLowerCase();
    //         if (content.includes('search') || content.includes('find')) {
    //           return { next: 'ProductSearch' };
    //         } else if (content.includes('compare')) {
    //           return { next: 'ProductComparison' };
    //         } else if (content.includes('order') || content.includes('buy')) {
    //           return { next: 'CreateOrder' };
    //         } else {
    //           return { next: 'Communicate' };
    //         }
    //       }
    //       return result.data;
    //     } catch (e) {
    //       console.error('❌ Failed to parse JSON supervisor output:', e);
    //       // Default fallback
    //       return { next: 'Communicate' };
    //     }
    //   },
    // });

    const supervisor_chain = RunnableSequence.from([prompt, llm, output_parser]);
    return supervisor_chain;
  }

  private create_search_product_agent() {
    const tools = [new ProductSearchTool(new ProductService())];
    const system_prompt = `
    You are a product search specialist. Your job is to find products that match user requirements.
    
    CAPABILITIES:
    - Search products by name, category, brand, price range
    - Filter products based on specific features
    - Find similar or alternative products
    
    INSTRUCTIONS:
    - Use the product_search tool to find relevant products
    - Extract search criteria from the user's request
    - If the user's query is vague, search broadly and let them refine
    - Always provide product details found in your search
    - If no products found, suggest alternative search terms
    `;
    const agent = this.create_tool_agent(this._genai, tools, system_prompt);
    return agent;
  }

  private create_product_comparison_agent() {
    const tools = [new ProductComparisonTool(new ProductService())];
    const system_prompt = `
    You are a product comparison specialist. Your job is to compare products and help users make informed decisions.
    
    CAPABILITIES:
    - Compare products side-by-side
    - Highlight key differences and similarities
    - Provide recommendations based on user needs
    
    INSTRUCTIONS:
    - Use the product_comparison tool to compare specific products
    - Look at agent_history to find products that were previously searched
    - Compare products on relevant criteria (price, features, quality, reviews)
    - Provide clear pros/cons for each product
    - If specific products weren't mentioned, ask for clarification
    `;
    const agent = this.create_tool_agent(this._genai, tools, system_prompt);
    return agent;
  }

  private create_create_order_agent(userId: string) {
    const tools = [new CreateOrderTool(new OrderService(), new UserService(), new ProductService(), userId)];
    const system_prompt = `
    You are an order creation specialist. Your job is to help users create orders for products.
    
    CAPABILITIES:
    - Create orders for selected products
    - Handle quantity, shipping, and payment details
    - Validate user information and product availability
    
    INSTRUCTIONS:
    - Use the create_order tool to process orders
    - Check agent_history for products the user has shown interest in
    - Confirm order details before processing
    - Handle any order-related questions or issues
    - If user is not authenticated, explain the requirement
    `;
    const agent = this.create_tool_agent(this._genai, tools, system_prompt);
    return agent;
  }

  private create_generate_response_agent() {
    const template = `
    You are a communication specialist responsible for creating the final response to the user.
    Your job is to synthesize all the work done by other agents and provide a comprehensive, helpful response.
  
    INSTRUCTIONS:
    1. ANALYZE the original user query: {messages}
    2. REVIEW all agent actions and results: {agent_history}
    3. SYNTHESIZE the information into a coherent response
    4. STRUCTURE your response appropriately (use lists, sections if helpful)
    5. INCLUDE all relevant details found by the agents
    6. ANSWER the user's original question completely
    7. PROVIDE actionable next steps if appropriate
  
    RESPONSE GUIDELINES:
    - Start by directly addressing the user's question
    - Include specific product information if found
    - Mention prices, features, comparisons made
    - If orders were created, confirm details
    - If no results found, explain why and suggest alternatives
    - Keep the tone helpful and conversational
    - Don't just summarize - provide value-added insights
  
    Agent History Summary:
    {agent_history}
    `;

    const system_prompt_template = new PromptTemplate({
      template: template,
      inputVariables: ['agent_history', 'messages'],
    });

    const system_message_prompt = new SystemMessagePromptTemplate(system_prompt_template);

    const prompt = ChatPromptTemplate.fromMessages([
      system_message_prompt,
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const responseGenerator = new RunnableLambda({
      func: async (msg: AIMessage) => {
        // Enhanced response generation with better context understanding
        const content = msg.content.toString();

        // Add some intelligence to format the response better
        let formattedResponse = content;

        // You could add additional formatting logic here
        // For example, parsing structured data, adding bullet points, etc.

        return {
          output: formattedResponse,
          intermediateSteps: [],
        };
      },
    });

    const agentRunnable = RunnableSequence.from([prompt, this._genai, responseGenerator]);

    return agentRunnable;
  }

  private create_tool_agent(llm: ChatGoogleGenerativeAI, tools: StructuredTool[], system_prompt: string) {
    const system_prompt_template = new PromptTemplate({
      template:
        system_prompt +
        `
        CONTEXT AWARENESS:
        Previous agent actions and results: {agent_history}
        
        EXECUTION GUIDELINES:
        - Focus ONLY on tasks relevant to your specialization
        - Use the agent_history to understand what has been done before
        - Don't repeat work that has already been completed
        - If you can't complete a task, clearly state why
        - Provide specific, actionable results

        ALWAY RESPONSE WITH VIETNAMESE  
        `,
      inputVariables: ['agent_history'],
    });

    const system_message_prompt = new SystemMessagePromptTemplate(system_prompt_template);
    const prompt = ChatPromptTemplate.fromMessages([
      system_message_prompt,
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt: prompt,
    });

    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      verbose: true,
      maxIterations: 3,
      returnIntermediateSteps: true,
    });

    return this.wrapAgentExecutor(executor);
  }

  private wrapAgentExecutor(executor: AgentExecutor): AgentWithInvoke {
    return {
      async invoke(input: any): Promise<AgentInvokeResult> {
        const result = await executor.invoke(input);
        if (!('output' in result) || !('intermediateSteps' in result)) {
          throw new Error('AgentExecutor result does not match AgentInvokeResult format');
        }

        return {
          output: result.output,
          intermediateSteps: result.intermediateSteps,
        };
      },
    };
  }

  private extractJSON(text: string): any | null {
    try {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      const jsonText = match ? match[1].trim() : text.trim();
      return JSON.parse(jsonText);
    } catch (err) {
      console.error('Lỗi khi parse JSON:', err);
      return { message: text.trim() };
    }
  }
}
