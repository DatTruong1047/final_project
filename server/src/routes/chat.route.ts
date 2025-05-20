import { FastifyInstance } from 'fastify';

import {
    SuccessResponseSchema,
    ErrorResponseSchema,
    ChatQuerySchema,
    ChatResponseSchema,
} from '@model';

import ChatService from '@services/chat.service';

import ChatController from '@controller/chat.controller';

export default async function chatRoutes(app: FastifyInstance): Promise<void> {
    const chatService = new ChatService();
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
}