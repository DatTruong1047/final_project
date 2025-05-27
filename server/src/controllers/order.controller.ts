import { FastifyReply, FastifyRequest } from 'fastify';

import app from '@app/app';
import { ErrorCodes } from '@app/config';
import {
  CreateOrderRequestType,
  ErrorResponseType,
  ListOrderResponseType,
  OrderFilterType,
  OrderResponseType,
  SuccessResponseType,
} from '@app/models';
import OrderService from '@app/services/order.service';
import { createPaymentIntent } from '@app/utils/stripe';

import { binding } from '@decorators/binding.decorator';

export default class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @binding
  async createOrder(
    request: FastifyRequest<{ Body: CreateOrderRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { userId } = request.decodedAccessToken;

      const result = await this._orderService.createOrderWithCardItems(request.body, userId);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };

        if (result.code === ErrorCodes.CART_NOT_FOUND) {
          return reply.NotFound(errorResponse);
        }

        return reply.BadRequest(errorResponse);
      }

      const paymentIntent = await createPaymentIntent(Number(result.data.totalAmount), result.data.id, userId);

      const paymentIntentData = {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret as string,
      };

      await this._orderService.addPaymentIntent(result.data.id, paymentIntentData.id, paymentIntentData.clientSecret);

      const responseData: OrderResponseType = {
        ...result.data,
        paymentIntent: paymentIntentData,
      };

      const response: SuccessResponseType<OrderResponseType> = {
        code: 200,
        data: responseData,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async getOrdersByUserId(
    request: FastifyRequest<{ Querystring: OrderFilterType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { userId } = request.decodedAccessToken;

      const result = await this._orderService.getOrdersByUserId(userId, request.query);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };

        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResponseType<ListOrderResponseType> = {
        code: 200,
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      app.log.error(`Get orders by user id failed: ${error}`);
      return app.handleErrorResponse(error, reply);
    }
  }
}
