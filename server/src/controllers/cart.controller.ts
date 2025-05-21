import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorCodes } from '@config';
import {
  CartListType,
  CartUpdateRequestType,
  CartUpsertRequestType,
  ErrorResponseType,
  SuccessResponseType,
  SuccessResWithoutDataType,
} from '@model';

import app from '@app/app';

import CartService from '@services/cart.service';

import { binding } from '@decorators/binding.decorator';

export default class CartController {
  constructor(private readonly _cartService: CartService) {}

  @binding
  async getUserCarts(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;

      const result = await this._cartService.getUserCarts(decodedAccessToken.userId);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResponseType<CartListType> = {
        code: 200,
        status: 'success',
        data: result.data,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async upSertCart(
    request: FastifyRequest<{ Body: CartUpsertRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;

      const result = await this._cartService.upSertCart(request.body, decodedAccessToken.userId);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResWithoutDataType = {
        code: 201,
        success: true,
      };

      return reply.Created(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async updateCart(
    request: FastifyRequest<{ Body: CartUpdateRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;

      const result = await this._cartService.updateCartQuantity(
        request.body.id,
        request.body.count,
        decodedAccessToken.userId
      );

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        if (result.code === ErrorCodes.CART_NOT_FOUND) {
          return reply.Forbidden(errorResponse);
        }
        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResWithoutDataType = {
        code: 200,
        success: true,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }

  @binding
  async deleteCart(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;

      const result = await this._cartService.deleteCart(request.params.id, decodedAccessToken.userId);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        return reply.BadRequest(errorResponse);
      }

      const response: SuccessResWithoutDataType = {
        code: 200,
        success: true,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }
}
