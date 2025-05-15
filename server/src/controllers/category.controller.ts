import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorResponseType, CategoryListType, SuccessResponseType } from '@model';

import CategoryService from '@services/category.service';

import { binding } from '@decorators/binding.decorator';
import app from '@app/app';

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
      return app.handleErrorResponse(error, reply);
    }
  }
}
