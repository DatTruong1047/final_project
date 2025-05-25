import { FastifyInstance } from 'fastify';

import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  ChatQuerySchema,
  ChatMessageResponseSchema,
  MergeChatSessionSchema,
  CreateChatSessionSchema,
} from '@model';

import ChatService from '@services/chat.service';

import ChatController from '@controller/chat.controller';
import GeminiService from '@app/services/gemini.service';
import { ToolRegistry } from '@app/tools/registry/tool.registry';
import ChatRepository from '@app/repositories/chat.repository';
import { initializeTools } from '@app/tools/init';
import ProductService from '@services/product.service';
import OrderService from '@services/order.service';
import UserService from '@services/user.service';

export default async function chatRoutes(app: FastifyInstance): Promise<void> {
  const toolRegistry = await initializeTools(new ProductService(), new OrderService(), new UserService());

  const chatService = new ChatService(new GeminiService(), toolRegistry, new ChatRepository());
  const chatController = new ChatController(chatService);

  app.post('/message', {
    schema: {
      tags: ['Chat'],
      summary: 'Send message to chatbot',
      body: ChatQuerySchema,
      response: {
        // 200: SuccessResponseSchema(ChatMessageResponseSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
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
      response: {
        // 200: SuccessResponseSchema(ChatMessageResponseSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.getChatMessages,
  });
}
