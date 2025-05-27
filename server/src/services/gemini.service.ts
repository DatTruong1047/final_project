import { readFileSync } from 'fs';

import { HumanMessage, BaseMessage, AIMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChainValues } from '@langchain/core/utils/types';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

import { geminiApiKey, geminiModel } from '@config';
import { RoleEnum } from 'generated/prisma';

import app from '@app/app';
import { ResultType } from '@app/models';
import ChatRepository from '@app/repositories/chat.repository';
import { CreateOrderTool } from '@app/tools/create-order.tool';
import { ProductComparisonTool } from '@app/tools/product-comparison.tool';
import { ProductSearchTool } from '@app/tools/product-seach.tool';

import OrderService from './order.service';
import ProductService from './product.service';
import UserService from './user.service';
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
      temperature: 0.5,
    });

    this._chatRepository = chatRepository;
  }

  async loadChatHistory(sessionId: string): Promise<BaseMessage[]> {
    const messagesFromDB = await this._chatRepository.getChatMessagesBySessionId(sessionId, 10, 0);
    return messagesFromDB.map((message) => {
      if (message.role === RoleEnum.User) {
        return new HumanMessage(message.content);
      }
      return new AIMessage(message.content);
    });
  }

  async generateResponse(query: string, sessionId: string, userId: string | null): Promise<ResultType<string>> {
    try {
      const chatHistory = await this.loadChatHistory(sessionId);

      const systemPrompt = readFileSync('src/config/sys_prompt.txt', 'utf-8');
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

      const result: ChainValues = await agentExecutor.invoke({
        input: query,
        chat_history: chatHistory,
      });

      app.log.info('Agent result:', result.output);
      app.log.info('Intermediate steps:', result.intermediateSteps);

      const response = result.output as string;

      if (!response) {
        throw new GeminiServiceError('Empty response from Gemini API', 'EMPTY_RESPONSE');
      }

      return {
        code: 200,
        success: true,
        message: 'Success',
        data: response,
      };
    } catch (error) {
      app.log.error('Error in generateResponse:', error);
      throw error;
    }
  }
}
