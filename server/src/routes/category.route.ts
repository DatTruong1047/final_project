import { FastifyInstance } from 'fastify';

import { SuccessResponseSchema, ErrorResponseSchema, CategoryListSchema } from '@app/models';
import CategoryService from '@app/services/category.service';

import CategoryController from '@controller/category.controller';

export default async function categoryRoutes(app: FastifyInstance): Promise<void> {
  const categoryController = new CategoryController(new CategoryService());

  app.get('/', {
    schema: {
      tags: ['Category'],
      response: {
        200: SuccessResponseSchema(CategoryListSchema),
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: categoryController.getCategoryList,
  });
}
