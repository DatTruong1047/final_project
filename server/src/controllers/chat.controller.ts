import { FastifyReply, FastifyRequest } from 'fastify';

import { ChatSession, RoleEnum } from 'generated/prisma';

import app from '@app/app';
import { ErrorCodes } from '@app/config';
import {
  ChatQueryType,
  SuccessResponseType,
  ChatMessageResponseType,
  ErrorResponseType,
  ChatSessionResponseType,
  CreateChatSessionType,
  MergeChatSessionType
} from '@app/models';

import ChatService from '@services/chat.service';

import { binding } from '@decorators/binding.decorator';

export default class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @binding
  async createChatSession(
    request: FastifyRequest<{ Body: CreateChatSessionType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { userId } = request.body;
      const anonymousId = request.headers['x-anonymous-id'] as string;

      if (!anonymousId && !userId) {
        const err: ErrorResponseType = {
          code: 400,
          message: 'User ID or anonymous ID is required',
        };

        return reply.BadRequest(err);
      }

      let chatSession: ChatSession;

      if (!userId) {
        chatSession = await this.chatService.findOrCreateChatSessionWithAnonymousId(anonymousId);
      } else {
        chatSession = await this.chatService.findOrCreateChatSession(userId);
      }

      const response: ChatSessionResponseType = {
        id: chatSession.id,
        userId: chatSession.userId,
        isActive: chatSession.isActive,
        createdAt: chatSession.createdAt.toISOString(),
        endedAt: chatSession.endedAt?.toISOString() || null,
        anonymousId: chatSession.anonymousId,
      };

      const res: SuccessResponseType<ChatSessionResponseType> = {
        code: 200,
        data: response,
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async endChatSession(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params;

      await this.chatService.endChatSession(id);

      const res: SuccessResponseType<void> = {
        code: 200,
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async getChatMessages(
    request: FastifyRequest<{ Params: { id: string }; Query: { take: number; skip: number; orderBy: 'asc' | 'desc' } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params;
      const { take, skip, orderBy } = request.query as { take: number; skip: number; orderBy: 'asc' | 'desc' };
      // Get by sessionId
      const messages = await this.chatService.getChatMessagesBySessionId(id, take, skip, orderBy);

      const response: ChatMessageResponseType = {
        chatMessages: messages.map((message) => ({
          id: message.id,
          content: message.content,
          role: message.role,
          createdAt: message.createdAt.toISOString(),
        })),
      };

      const res: SuccessResponseType<ChatMessageResponseType> = {
        code: 200,
        data: response,
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async sendMessage(request: FastifyRequest<{ Body: ChatQueryType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { content, sessionId } = request.body;

      if (!sessionId) {
        const err: ErrorResponseType = {
          code: 400,
          message: 'Session ID is required',
        };

        return reply.BadRequest(err);
      }

      // Create user message
      const createUserMessage = await this.chatService.createChatMessage(sessionId, content, RoleEnum.User);

      if (!createUserMessage.success) {
        const err: ErrorResponseType = {
          code: createUserMessage.code,
          message: createUserMessage.message,
        };

        return reply.BadRequest(err);
      }

      // Send message to Gemini and create assistant message
      const response = await this.chatService.sendMessage(content, sessionId);

      if (!response.success) {
        const err: ErrorResponseType = {
          code: response.code,
          message: response.message,
        };

        app.log.error('Error in chat message:', err);

        if (response.code === ErrorCodes.RATE_LIMIT || response.code === ErrorCodes.QUOTA_EXCEEDED) {
          return reply.TooManyRequests(err);
        }

        return reply.BadRequest(err);
      }

      const res: SuccessResponseType<ChatMessageResponseType> = {
        code: 200,
        data: {
          chatMessages: [
            {
              sessionId,
              id: response.data.id,
              content: response.data.content,
              role: RoleEnum.Assistant,
              createdAt: response.data.createdAt.toISOString(),
            },
          ],
        },
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async mergeChatSession(
    request: FastifyRequest<{ Body: MergeChatSessionType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { userId, anonymousId } = request.body;

      const result = await this.chatService.mergeChatSession(userId, anonymousId);

      if (!result.success) {
        const err: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };

        return reply.BadRequest(err);
      }

      const res: SuccessResponseType<void> = {
        code: 200,
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

}
