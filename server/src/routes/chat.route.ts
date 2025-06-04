import { FastifyInstance } from 'fastify';

import { ErrorResponseSchema, ChatQuerySchema, MergeChatSessionSchema, CreateChatSessionSchema, GetMessagesQuerySchema } from '@model';

import ChatRepository from '@app/repositories/chat.repository';
import GeminiService from '@app/services/gemini.service';

import ChatService from '@services/chat.service';

import ChatController from '@controller/chat.controller';

export default async function chatRoutes(app: FastifyInstance): Promise<void> {
  const chatRepository = new ChatRepository();
  const geminiService = new GeminiService(chatRepository);

  const chatService = new ChatService(geminiService, chatRepository);
  const chatController = new ChatController(chatService);

  app.post('/message', {
    schema: {
      tags: ['Chat'],
      summary: 'Process chat message',
      body: ChatQuerySchema,
      response: {
        // 200: SuccessResponseSchema,
      },
    },
    handler: chatController.sendMessage,
  });

  app.put('/merge-chat-session', {
    schema: {
      tags: ['Chat'],
      summary: 'Merge chat session',
      body: MergeChatSessionSchema,
      response: {
        // 200: SuccessResponseSchema,
        400: ErrorResponseSchema,
        429: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.mergeChatSession,
  });

  app.post('/session', {
    schema: {
      tags: ['Chat'],
      summary: 'Create chat session',
      body: CreateChatSessionSchema,
      response: {
        // 200: SuccessResponseSchema(ProductMetadataSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.createChatSession,
  });

  app.delete('/session/:id', {
    schema: {
      tags: ['Chat'],
      summary: 'End chat session',
      response: {
        // 200: SuccessResponseSchema(ChatResponseSchema),
      },
    },
    handler: chatController.endChatSession,
  });

  app.get('/session/:id/messages', {
    schema: {
      tags: ['Chat'],
      summary: 'Get chat messages',
      querystring: GetMessagesQuerySchema,
      response: {
        // 200: SuccessResponseSchema(ChatMessageResponseSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.getChatMessages,
  });
}
