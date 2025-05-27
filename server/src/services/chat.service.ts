import { ChatMessage, ChatSession, RoleEnum } from 'generated/prisma';

import app from '@app/app';
import { ErrorCodes } from '@app/config/error.config';
import { ResultType } from '@app/models';
import ChatRepository from '@app/repositories/chat.repository';

import GeminiService from '@services/gemini.service';

export default class ChatService {
  private readonly _geminiService: GeminiService;
  private readonly _chatRepository: ChatRepository;

  constructor(geminiService: GeminiService, chatRepository: ChatRepository) {
    this._geminiService = geminiService;
    this._chatRepository = chatRepository;
  }

  async sendMessage(query: string, sessionId: string): Promise<ResultType<ChatMessage>> {
    try {
      const existSession = await this._chatRepository.getChatSession(sessionId);
      if (!existSession) {
        return {
          code: ErrorCodes.SESSION_NOT_FOUND,
          data: null,
          success: false,
          message: 'Session not found',
        };
      }

      const generateResponseResult = await this._geminiService.generateResponse(
        query,
        sessionId,
        existSession.userId || null
      );

      let chatMessage: ChatMessage;
      if (!generateResponseResult.success) {
        chatMessage = await this._chatRepository.createChatMessage(
          sessionId,
          "Sorry, I can't help with that. Please try again later.",
          RoleEnum.Assistant
        );
      } else {
        chatMessage = await this._chatRepository.createChatMessage(
          sessionId,
          generateResponseResult.data?.toString() || '',
          RoleEnum.Assistant
        );
      }

      return {
        code: 200,
        data: chatMessage,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getChatMessagesBySessionId(
    sessionId: string,
    take = 10,
    skip = 0,
    orderBy: 'asc' | 'desc' = 'asc'
  ): Promise<ChatMessage[]> {
    const chatMessages = await this._chatRepository.getChatMessagesBySessionId(sessionId, take, skip, orderBy);
    return chatMessages;
  }

  async createChatSession(userId: string): Promise<ChatSession> {
    const chatSession = await this._chatRepository.createChatSession(userId);
    return chatSession;
  }

  async findOrCreateChatSession(userId: string): Promise<ChatSession> {
    try {
      const chatSession = await this._chatRepository.getActiveChatSessionByUserId(userId);
      if (chatSession) {
        return chatSession;
      }
      return this._chatRepository.createChatSession(userId);
    } catch (error) {
      throw error;
    }
  }

  async createChatMessage(sessionId: string, content: string, role: RoleEnum): Promise<ResultType<ChatMessage>> {
    try {
      const existSession = await this._chatRepository.getChatSession(sessionId);
      if (!existSession) {
        return {
          code: ErrorCodes.SESSION_NOT_FOUND,
          data: null,
          success: false,
          message: 'Session not found',
        };
      }

      const chatMessage = await this._chatRepository.createChatMessage(sessionId, content, role);
      return {
        code: 200,
        data: chatMessage,
        success: true,
      };
    } catch (error) {
      return {
        code: ErrorCodes.CREATE_CHAT_MESSAGE_FAILED,
        data: null,
        success: false,
        message: 'Create chat message failed',
      };
    }
  }

  async endChatSession(sessionId: string): Promise<void> {
    await this._chatRepository.endChatSession(sessionId);
  }

  async mergeChatSession(userId: string, anonymousId: string): Promise<ResultType<void>> {
    try {
      const anonymousActiveChatSession = await this._chatRepository.getActiveChatSessionByAnonymousId(anonymousId);

      if (!anonymousActiveChatSession) {
        return {
          code: ErrorCodes.SESSION_NOT_FOUND,
          data: null,
          success: false,
          message: 'Session not found',
        };
      }

      // User doesn't have an active chat session
      const chatSession = await this._chatRepository.getActiveChatSessionByUserId(userId);
      if (!chatSession) {
        await this._chatRepository.updateChatSessionFromAnonymousToUser(anonymousId, userId);
        return {
          code: 200,
          data: null,
          success: true,
          message: 'Chat session merged',
        };
      }

      // User has an active chat session
      await this._chatRepository.mergeChatSession(chatSession.id, anonymousActiveChatSession.id);
      await this.endChatSession(anonymousActiveChatSession.id);

      return {
        code: 200,
        data: null,
        success: true,
        message: 'Chat session merged',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateChatSessionWithAnonymousId(anonymousId: string): Promise<ChatSession> {
    try {
      const chatSession = await this._chatRepository.getActiveChatSessionByAnonymousId(anonymousId);
      if (chatSession) {
        return chatSession;
      }
      return this._chatRepository.createAnonymousChatSession(anonymousId);
    } catch (error) {
      app.log.error('Error in findOrCreateChatSessionWithAnonymousId:', error);
      throw new Error('findOrCreateChatSessionWithAnonymousId error');
    }
  }
}
