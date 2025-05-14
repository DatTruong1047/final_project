import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorResponseType, CategoryListType, SuccessResponseType } from '@model';

import CategoryService from '@services/category.service';

import { binding } from '@decorators/binding.decorator';

export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @binding
  async getCategoryList(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const result = await this.categoryService.getCategoryList();

      const response: SuccessResponseType<CategoryListType> = {
        code: 200,
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      const errorResponse: ErrorResponseType = {
        message: error.message,
        code: error.code,
      };
      return reply.BadRequest(errorResponse);
    }
  }
}
