import { FastifyInstance } from 'fastify';

import OrderController from '@app/controllers/order.controller';
import { CreateOrderRequestSchema } from '@app/models';
import { ListOrderResponseSchema, OrderFilterSchema, OrderResponseSchema } from '@app/models/order.schema';
import { SuccessResponseSchema } from '@app/models/response.schema';
import { ErrorResponseSchema } from '@app/models/response.schema';
import OrderService from '@app/services/order.service';

export default async function orderRoutes(app: FastifyInstance): Promise<void> {
  const orderController = new OrderController(new OrderService());

  app.post('/', {
    schema: {
      tags: ['Order'],
      summary: 'Create a order',
      body: CreateOrderRequestSchema,
      response: {
        200: SuccessResponseSchema(OrderResponseSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: orderController.createOrder,
  });

  app.get('/', {
    schema: {
      tags: ['Order'],
      summary: 'Get orders by user id',
      querystring: OrderFilterSchema,
      response: {
        200: SuccessResponseSchema(ListOrderResponseSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        403: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: orderController.getOrdersByUserId,
  });
}
