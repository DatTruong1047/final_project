import { FastifyReply, FastifyRequest } from 'fastify';

import app from '@app/app';
import { ErrorCodes } from '@app/config';
import {
  ChatQueryType,
  SuccessResponseType,
  ChatResponseType,
  ChatMessageResponseType,
  ErrorResponseType,
} from '@app/models';

import ChatService from '@services/chat.service';

import { binding } from '@decorators/binding.decorator';

export default class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @binding
  async search(request: FastifyRequest<{ Body: ChatQueryType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { query } = request.body;
      const result = await this.chatService.search(query);

      const res: ChatResponseType = {
        query,
        response: [],
      };

      for (const item of result) {
        const metadata = {
          name: item.metadata.product_name || '',
          slug: item.metadata.product_slug || '',
          sku: item.metadata.product_sku || '',
          image: item.metadata.product_image || [],
          short_description: item.metadata.product_short_description || '',
          price:
            typeof item.metadata.product_price === 'string'
            ? parseFloat(item.metadata.product_price) || 0
            : item.metadata.product_price ?? 0,
          category_name: item.metadata.category_name || '',
          brand_name: item.metadata.brand_name || '',
          attributes: item.metadata.product_attributes || {},
          summary: item.metadata.product_summary || '',
        };

        res.response.push({
          metadata,
        });
      }

      const response: SuccessResponseType<ChatResponseType> = {
        code: 200,
        data: res,
        status: 'success',
      };
      return reply.OK(response);
    } catch (error) {
      app.log.error('Error in chat search:', error);
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async sendMessage(request: FastifyRequest<{ Body: ChatQueryType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { query } = request.body;

      const response = await this.chatService.sendMessage(query);

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
          query,
          response: response.data?.toString() || '',
        },
        status: 'success',
      };

      return reply.OK(res);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }
}
