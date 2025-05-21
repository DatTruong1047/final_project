import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorResponseType, ProductDetailType, ProductFilterType, ProductListType, SuccessResponseType } from '@model';

import app from '@app/app';

import ProductService from '@services/product.service';

import { binding } from '@decorators/binding.decorator';

export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  @binding
  async getProductById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params;
      const result = await this.productService.getProductById(id);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          message: result.message,
          code: result.code,
        };
        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResponseType<ProductDetailType> = {
        code: 200,
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async getProductList(
    request: FastifyRequest<{ Querystring: ProductFilterType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const result = await this.productService.getProductList(request.query);

      const response: SuccessResponseType<ProductListType> = {
        code: 200,
        status: 'success',
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }
}
