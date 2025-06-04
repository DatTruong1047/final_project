import { HumanMessage, BaseMessage, AIMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

import { geminiApiKey, geminiModel_2_0, geminiModel_1_5, ErrorCodes } from '@app/config';
import { RoleEnum } from 'generated/prisma';
import {
  ProductSearchOutputSchema,
  ProductComparisonOutputSchema,
  CreateOrderOutputSchema,
  CommunicateOutputSchema,
  CreateOrderExtractionSchema,
  CreateOrderExtractionType,
  AgentResultType,
} from '@app/models';
import ChatRepository from '@app/repositories/chat.repository';

import { AgentInvokeResult, AgentState, AgentWithInvoke, GeminiServiceError, ResultType } from '@app/types/agent.types';
import { AgentFactory } from '@app/agents/agent.factory';
import { AgentManager } from '@app/agents/agent.manager';

export default class GeminiService {
  private readonly _genai_2_0: ChatGoogleGenerativeAI;
  private readonly _genai_1_5: ChatGoogleGenerativeAI;
  private readonly _chatRepository: ChatRepository;
  private _agentManager: AgentManager | null = null;

  constructor(chatRepository: ChatRepository) {
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

    this._chatRepository = chatRepository;
  }

  private initializeAgentManager(userId: string | null) {
    if (!this._agentManager) {
      this._agentManager = new AgentManager(new AgentFactory(userId), this._genai_1_5);
    }
  }

  async loadChatHistory(sessionId: string): Promise<BaseMessage[]> {
    const { chatMessages } = await this._chatRepository.getChatMessagesBySessionId(sessionId, 20, 0, 'desc');

    const messages = chatMessages.reverse();

    return messages
      .filter((message) => message.content && message.content.trim() !== '')
      .map((message) => {
        if (!message.content) {
          console.warn('Empty message content found:', message);
          return null;
        }
        if (message.role === RoleEnum.User) {
          return new HumanMessage(message.content);
        }
        return new AIMessage(message.content);
      })
      .filter((message): message is BaseMessage => message !== null); // Remove null messages
  }

  async generateResponseWithAgent(query: string, sessionId: string, userId: string | null): Promise<ResultType<AgentResultType>> {
    this.initializeAgentManager(userId);
    const chatHistory = await this.loadChatHistory(sessionId);
    const userMessage: HumanMessage = new HumanMessage({ content: query });

    let state: AgentState = {
      messages: [userMessage],
      agent_history: chatHistory,
      next: 'Supervisor',
    };

    let iteration = 0;
    const maxIteration = 10;

    while (iteration < maxIteration) {
      try {
        iteration++;

        const result = await this._agentManager.executeAgent(state);
        if (result.isFinal) {
          return {
            code: 200,
            success: true,
            message: 'Success',
            data: {
              content: result.data!.content,
              tool: result.data!.tool,
              error_detail: '',
            },
          };
        } else {
          state = result.newState;
        }
      } catch (error) {
        console.error('Error executing agent:', error);
        return {
          code: 500,
          success: false,
          message: 'Error executing agent',
          data: {
            content: 'Hệ thống đang bảo trì, vui lòng thử lại sau',
            error_detail: error instanceof Error ? error.message : String(error),
          },
        };
      }
    }

    return {
      code: 500,
      success: false,
      message: 'Hệ thống không thể xử lý yêu cầu của bạn vào lúc này. Vui lòng thử lại sau.',
      data: {
        content: 'Hệ thống đang bảo trì, vui lòng thử lại sau',
        error_detail: 'Max iterations reached without a final response.',
      },
    };
  }
}
