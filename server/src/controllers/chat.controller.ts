import { FastifyReply, FastifyRequest } from 'fastify';

import ChatService from '@services/chat.service';
import { Document } from '@langchain/core/documents';

import { binding } from '@decorators/binding.decorator';
import { ChatQueryType, SuccessResponseType, SuccessResWithoutDataType, ChatResponseType } from '@app/models';
import app from '@app/app';

export default class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @binding
  async search(request: FastifyRequest<{ Body: ChatQueryType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { query } = request.body;
      const result = await this.chatService.search(query);
      // console.log('Search result:', JSON.stringify(result, null, 2));
      
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
          price: typeof item.metadata.product_price === 'string' ? parseFloat(item.metadata.product_price) : (item.metadata.product_price || 0),
          category_name: item.metadata.category_name || '',
          brand_name: item.metadata.brand_name || '',
          attributes: item.metadata.product_attributes || {},
          summary: item.metadata.product_summary || '',
        };

        res.response.push({
          metadata,
        });
      }

      // console.log('Final response:', JSON.stringify(res, null, 2));

      const response: SuccessResponseType<ChatResponseType> = {
        code: 200,
        data: res,
        status: 'success',
      };
      return reply.OK(response);
    } catch (error) {
      console.error('Error in chat controller:', error);
      return app.handleErrorResponse(error, reply);
    }
  }
}
