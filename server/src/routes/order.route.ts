import OrderController from '@app/controllers/order.controller';
import { FastifyInstance } from 'fastify';
import OrderService from '@app/services/order.service';
import { SuccessResponseSchema } from '@app/models/response.schema';
import { OrderResponseSchema } from '@app/models/order.schema';
import { ErrorResponseSchema } from '@app/models/response.schema';
import { CreateOrderRequestSchema } from '@app/models';

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
      response: {
        200: SuccessResponseSchema(OrderResponseSchema.array()),
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
