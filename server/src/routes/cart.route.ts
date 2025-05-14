import { FastifyInstance } from 'fastify';

import {
  SuccessResponseSchema,
  ErrorResponseSchema,
  CartListSchema,
  CartUpsertRequestSchema,
  SuccessResWithoutDataSchema,
  CartUpdateRequestSchema,
} from '@model';

import CartService from '@services/cart.service';

import CartController from '@controller/cart.controller';

export default async function cartRoutes(app: FastifyInstance): Promise<void> {
  const cartService = new CartService();
  const cartController = new CartController(cartService);

  app.get('/', {
    schema: {
      tags: ['Cart'],
      response: {
        200: SuccessResponseSchema(CartListSchema),
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: cartController.getUserCarts,
  });

  app.post('/', {
    schema: {
      tags: ['Cart'],
      body: CartUpsertRequestSchema,
      response: {
        201: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: cartController.upSertToCart,
  });

  app.put('/', {
    schema: {
      tags: ['Cart'],
      body: CartUpdateRequestSchema,
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: cartController.updateCart,
  });

  app.delete('/:id', {
    schema: {
      tags: ['Cart'],
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: cartController.deleteCart,
  });
}
