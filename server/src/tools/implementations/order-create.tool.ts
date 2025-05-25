import { CreateOrderWithChatSchema, CreateOrderWithChatType, OrderResponseType, ResultType } from '@app/models';
import { BaseTool } from '../base/base.tool';
import OrderService from '@app/services/order.service';
import UserService from '@app/services/user.service';
import { createPaymentIntent } from '@app/utils/stripe';
import { OrderStatusEnum } from 'generated/prisma';
import app from '@app/app';

export class OrderCreateTool extends BaseTool {
  protected name = 'order_create';
  protected description = 'Create an order';
  protected schema = CreateOrderWithChatSchema;
  private readonly _orderService: OrderService;
  private readonly _userService: UserService;

  constructor(orderService: OrderService, userService: UserService) {
    super();
    this._userService = userService;
    this._orderService = orderService;
  }

  async createOrderWithChat(query: CreateOrderWithChatType): Promise<ResultType<OrderResponseType>> {
    try {
      const user = await this._userService.getUserById(query.userId);
      if (!user) {
        return {
          code: 401,
          message: 'User not found',
          success: false,
        };
      }

      const createOrderResult = await this._orderService.createOrderWithChat(query);

      if (!createOrderResult.success) {
        return {
          code: createOrderResult.code,
          message: createOrderResult.message,
          success: false,
        };
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

      await this._orderService.updateOrderStatus(createOrderResult.data.id, OrderStatusEnum.PROCESSING);
      await this._orderService.addPaymentIntent(
        createOrderResult.data.id,
        paymentIntentData.id,
        paymentIntentData.clientSecret
      );

      const responseData: OrderResponseType = {
        ...createOrderResult.data,
        paymentIntent: paymentIntentData,
      };

      return {
        code: 200,
        message: 'Order created successfully',
        success: true,
        data: responseData,
      };
    } catch (error) {
      app.log.error('Error in createOrder:', error);
      throw error;
    }
  }

  async execute(input: CreateOrderWithChatType) {
    return await this.createOrderWithChat(input);
  }
}
