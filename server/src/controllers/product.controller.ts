import { FastifyReply, FastifyRequest } from 'fastify';

import { binding } from '@decorators/binding.decorator';
import { ErrorResponseType, ProductDetailType, ProductFilterType, ProductListType, SuccessResponseType } from '@model';
import ProductService from '@services/product.service';

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
      return reply.InternalServer(error);
    }
  }

  @binding
  async getProductList(
    request: FastifyRequest<{ Querystring: ProductFilterType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { page, limit, brandId, categoryId } = request.query;
      const result = await this.productService.getProductList({ page, limit, brandId, categoryId });

      const response: SuccessResponseType<ProductListType> = {
        code: 200,
        status: 'success',
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      console.log(error);
      return reply.InternalServer(error);
    }
  }
}
