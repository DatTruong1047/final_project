import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { OrderStatusEnum } from 'generated/prisma';

import app from '@app/app';
import { CreateOrderInputType, CreateOrderSchema, OrderResponseType } from '@app/models';
import OrderService from '@app/services/order.service';
import UserService from '@app/services/user.service';
import { createPaymentIntent } from '@app/utils/stripe';

import ProductService from '@services/product.service';

export class CreateOrderTool extends StructuredTool {
  name = 'create_order';
  description = 'Create an order';
  schema = CreateOrderSchema;

  private readonly _orderService: OrderService;
  private readonly _userService: UserService;
  private readonly _userId: string | null;
  private readonly _productService: ProductService;
  constructor(
    orderService: OrderService,
    userService: UserService,
    productService: ProductService,
    userId: string | null
  ) {
    super();
    this._userService = userService;
    this._productService = productService;
    this._orderService = orderService;
    this._userId = userId;
  }

  async _call(input: CreateOrderInputType): Promise<string> {
    try {
      if (!this._userId) {
        return JSON.stringify({
          result: [],
          message: 'Yêu cầu đăng nhập để tạo đơn hàng',
        });
      }

      const user = await this._userService.getUserById(this._userId);
      if (!user) {
        return JSON.stringify({
          result: [],
          message: `Không tìm thấy tài khoản với ID: ${this._userId}`,
        });
      }

      const findSimilarProduct = await this._productService.findSimilarProductIds(input.productName, 5);
      if (findSimilarProduct.data.length === 0) {
        return JSON.stringify({
          result: [],
          message: `Không tìm thấy sản phẩm với tên: ${input.productName}`,
        });
      }

      const product = findSimilarProduct.data.find((product) => product.similarity > 0.95);
      if (!product) {
        return JSON.stringify({
          result: [],
          message: `Tìm thấy ${findSimilarProduct.data.length} sản phẩm với các tên: ${input.productName}. Hỏi lại khách hàng về tên chính xác sản phẩm muốn mua`,
        });
      }

      const createOrderResult = await this._orderService.createOrderWithChat({
        ...input,
        productId: product.id,
        userId: this._userId,
      });

      if (!createOrderResult.success) {
        return JSON.stringify({
          result: [],
          message: `Lỗi khi tạo đơn hàng: ${createOrderResult.message}`,
        });
      }

      const paymentIntent = await createPaymentIntent(
        Number(createOrderResult.data.totalAmount),
        createOrderResult.data.id,
        user.id
      );

      const paymentIntentData = {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret as string,
      };

      await this._orderService.updateOrderStatus(createOrderResult.data.id, OrderStatusEnum.CREATED);
      await this._orderService.addPaymentIntent(
        createOrderResult.data.id,
        paymentIntentData.id,
        paymentIntentData.clientSecret
      );

      const responseData: OrderResponseType = {
        ...createOrderResult.data,
        paymentIntent: paymentIntentData,
      };

      return JSON.stringify({
        result: [
          {
            ...responseData,
          },
        ],
        message: 'Đơn hàng đã được tạo thành công',
      });
    } catch (error) {
      app.log.error('Error in createOrder:', error);
      return JSON.stringify({
        result: [],
        message: `Đã xảy ra lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại: ${
          error instanceof Error ? error.message : String(error)
        }`,
        errorDetail: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
