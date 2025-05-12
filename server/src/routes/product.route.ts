import { FastifyInstance } from 'fastify';

import ProductController from '@controller/product.controller';
import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  ProductDetailSchema,
  ProductListSchema,
  ProductFilterSchema,
} from '@model';
import ProductService from '@services/product.service';
export default async function productRoutes(app: FastifyInstance): Promise<void> {
  const productController = new ProductController(new ProductService());

  app.get('/:id', {
    schema: {
      tags: ['Product'],

      response: {
        200: SuccessResponseSchema(ProductDetailSchema),
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    handler: productController.getProductById,
  });

  app.get('/', {
    schema: {
      tags: ['Product'],
      querystring: ProductFilterSchema,
      response: {
        200: SuccessResponseSchema(ProductListSchema),
      },
    },
    handler: productController.getProductList,
  });
}
