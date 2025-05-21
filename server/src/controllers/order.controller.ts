import { FastifyReply, FastifyRequest } from 'fastify';

import OrderService from '@app/services/order.service';

import { binding } from '@decorators/binding.decorator';
import app from '@app/app';
import { CreateOrderRequestType, ErrorResponseType, OrderResponseType, SuccessResponseType, SuccessResWithoutDataType } from '@app/models';
import { ErrorCodes } from '@app/config';
import { createPaymentIntent } from '@app/utils/stripe';
import { OrderStatusEnum } from 'generated/prisma';

export default class OrderController {
  constructor(private readonly _orderService: OrderService) {}

  @binding
  async createOrder(request: FastifyRequest<{ Body: CreateOrderRequestType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { userId } = request.decodedAccessToken;

      const result = await this._orderService.createOrder( request.body, userId );

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
      await this._orderService.updateOrderStatus(result.data.id, OrderStatusEnum.PROCESSING);
      await this._orderService.addPaymentIntentId(result.data.id, paymentIntent.id);
      
      const responseData: OrderResponseType = {
        ...result.data,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret as string,
        },
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
  async getOrdersByUserId (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { userId } = request.decodedAccessToken;

      const result = await this._orderService.getOrdersByUserId(userId);

      const response: SuccessResponseType<OrderResponseType[]> = {
        code: 200,
        data: result,
      };

      return reply.OK(response);
    } catch (error) {
      app.log.error(`Get orders by user id failed: ${error}`);
      return app.handleErrorResponse(error, reply);
    }
  }
}