import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { StructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { BaseMessage } from '@langchain/core/messages';

import {
  geminiApiKey,
  geminiModel_1_5,
  geminiModel_2_0,
  SYSTEM_PROMPT_FOR_COMMUNICATE,
  SYSTEM_PROMPT_FOR_COMPARISON,
  SYSTEM_PROMPT_FOR_CREATE_ORDER,
  SYSTEM_PROMPT_FOR_CREATE_ORDER_INFO,
  SYSTEM_PROMPT_FOR_PRODUCT_SEARCH,
  SYSTEM_PROMPT_FOR_SUPERVISOR,
} from '@config';

import {
  CommunicateOutputSchema,
  CreateOrderExtractionSchema,
} from '@app/models';
import { CreateOrderTool } from '@app/tools/create-order.tool';
import { ProductComparisonTool } from '@app/tools/product-comparison.tool';
import { ProductSearchTool } from '@app/tools/product-seach.tool';

import OrderService from '@app/services/order.service';
import ProductService from '@app/services/product.service';
import UserService from '@app/services/user.service';

import { AgentInvokeResult, AgentWithInvoke, GeminiServiceError } from '@app/types/agent.types';

export class AgentFactory {
  private readonly _genai_2_0: ChatGoogleGenerativeAI;
  private readonly _genai_1_5: ChatGoogleGenerativeAI;
  private readonly _userId: string | null;

  constructor(userId: string | null) {
    if (!geminiApiKey) {
      throw new GeminiServiceError('Gemini API key is not configured', 'CONFIG_ERROR');
    }

    this._genai_2_0 = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: geminiModel_2_0,
      temperature: 0.5,
    });

    this._genai_1_5 = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: geminiModel_1_5,
      temperature: 0,
    });

    this._userId = userId;
  }

  public get genai1_5(): ChatGoogleGenerativeAI {
    return this._genai_1_5;
  }

  public get userId(): string | null {
    return this._userId;
  }

  public get genai2_0(): ChatGoogleGenerativeAI {
    return this._genai_2_0;
  }

  public async createSupervisorAgent(): Promise<AgentWithInvoke> {
    enum members {
      ProductSearch = 'ProductSearch',
      ProductComparison = 'ProductComparison',
      CreateOrderExtractor = 'CreateOrderExtractor',
      Communicate = 'Communicate',
    }

    const SupervisorOutputSchema = z.object({
      next: z.nativeEnum(members).default(members.Communicate),
    });

    const sys_prompt_main = SYSTEM_PROMPT_FOR_SUPERVISOR;

    const promptTemplate = await ChatPromptTemplate.fromMessages([
      ['system', sys_prompt_main],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_history'),
    ]).partial({
      members: Object.values(members).join(', '),
      options: Object.values(members).join(' | '),
    });

    const supervisor_chain = promptTemplate.pipe(this._genai_1_5.withStructuredOutput(SupervisorOutputSchema));

    return {
      async invoke(input: { messages: BaseMessage[]; agent_history: BaseMessage[] }): Promise<AgentInvokeResult> {
        const result = await supervisor_chain.invoke(input);
        return {
          output: JSON.stringify(result, null, 2),
          intermediateSteps: [], 
        };
      },
    };
  }

  public createProductSearchAgent(): AgentWithInvoke {
    const tools = [new ProductSearchTool(new ProductService())];
    const system_prompt = SYSTEM_PROMPT_FOR_PRODUCT_SEARCH;
    return this.createToolAgent(this._genai_2_0, tools, system_prompt);
  }

  public createProductComparisonAgent(): AgentWithInvoke {
    const tools = [new ProductComparisonTool(new ProductService())];
    const system_prompt = SYSTEM_PROMPT_FOR_COMPARISON;
    return this.createToolAgent(this._genai_2_0, tools, system_prompt);
  }

  // public createCreateOrderAgent(): AgentWithInvoke {
  //   if (!this._userId) {
  //     throw new GeminiServiceError('User ID is required to create an order.', 'AUTH_ERROR');
  //   }
  //   const tools = [new CreateOrderTool(new OrderService(), new UserService(), new ProductService(), this._userId)];
  //   const system_prompt = SYSTEM_PROMPT_FOR_CREATE_ORDER;
  //   return this.createToolAgent(this._genai_2_0, tools, system_prompt);
  // }

  public createCreateOrderInfoExtractorAgent(): AgentWithInvoke {
    const system_prompt = SYSTEM_PROMPT_FOR_CREATE_ORDER_INFO;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', system_prompt],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_history'),
    ]);

    const extractionChain = promptTemplate.pipe(this._genai_1_5.withStructuredOutput(CreateOrderExtractionSchema));

    return {
      async invoke(input: { messages: BaseMessage[]; agent_history: BaseMessage[] }): Promise<AgentInvokeResult> {
        const result = await extractionChain.invoke(input);
        return {
          output: JSON.stringify(result, null, 2),
          intermediateSteps: [],
        };
      },
    };
  }

  public createCommunicateAgent(): AgentWithInvoke {
    const template = SYSTEM_PROMPT_FOR_COMMUNICATE;
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

    const structured_output_parser = this._genai_1_5.withStructuredOutput(CommunicateOutputSchema);

    const agentRunnable = prompt.pipe(structured_output_parser);
    return {
      async invoke(input: any): Promise<AgentInvokeResult> {
        const result = await agentRunnable.invoke(input);
        return {
          output: JSON.stringify(result, null, 2),
          intermediateSteps: [],
        };
      },
    };
  }

  private createToolAgent(llm: ChatGoogleGenerativeAI, tools: StructuredTool[], system_prompt: string): AgentWithInvoke {
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
}