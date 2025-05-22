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
} from '@model';

import ChatService from '@services/chat.service';

import ChatController from '@controller/chat.controller';
import GeminiService from '@app/services/gemini.service';
import ProductService from '@app/services/product.service';

export default async function chatRoutes(app: FastifyInstance): Promise<void> {
  const chatService = new ChatService(new GeminiService(), new ProductService());
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

  app.post('/product-search', {
    schema: {
      tags: ['Chat'],
      summary: 'Search for products',
      body: ProductSearchQuerySchema,
      response: {
        // 200: SuccessResponseSchema(ProductMetadataSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.productSearch,
  });

  app.post('/product-comparison', {
    schema: {
      tags: ['Chat'],
      summary: 'Compare products',
      body: ProductComparisonInputSchema,
      response: {
        // 200: SuccessResponseSchema(ChatResponseSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: chatController.productComparison,
  });
}
