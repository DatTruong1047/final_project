import { FastifyInstance } from 'fastify';

import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  ProductDetailSchema,
  ProductListSchema,
  ProductFilterSchema,
} from '@model';

import ProductService from '@services/product.service';

import ProductController from '@controller/product.controller';
export default async function productRoutes(app: FastifyInstance): Promise<void> {
  const productService = new ProductService();
  const productController = new ProductController(productService);

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
