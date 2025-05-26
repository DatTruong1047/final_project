import { FastifyInstance } from 'fastify';

import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  ChatQuerySchema,
  ChatResponseSchema,
  ChatMessageResponseSchema,

  ProductSearchQuerySchema,
  ProductListSchema,
  ProductMetadataSchema,
  ProductComparisonInputSchema,
  CreateOrderWithChatSchema,
  OrderResponseSchema,

} from '@model';

import ChatService from '@services/chat.service';

import ChatController from '@controller/chat.controller';
import GeminiService from '@app/services/gemini.service';
import ProductService from '@app/services/product.service';
import OrderService from '@app/services/order.service';
import UserService from '@app/services/user.service';

export default async function chatRoutes(app: FastifyInstance): Promise<void> {
  const chatService = new ChatService(new GeminiService(), new ProductService(), new OrderService(), new UserService());

  const chatController = new ChatController(chatService);

  app.post('/', {
    schema: {
      tags: ['Chat'],
      summary: 'Vector search for products',
      body: ChatQuerySchema,
      response: {
        200: SuccessResponseSchema(ChatResponseSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.search,
  });
  app.post('/message', {
    schema: {
      tags: ['Chat'],
      summary: 'Send message to chatbot',
      body: ChatQuerySchema,
      response: {
        200: SuccessResponseSchema(ChatMessageResponseSchema),
        400: ErrorResponseSchema,
        429: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.sendMessage,
  });
}
