import {
  CreateOrderRequestType,
  CreateOrderResultType,
  CreateOrderWithChatType,
  OrderFilterType,
  ListOrderResponseType,
  ResultType,
} from '@model';
import { Order, OrderStatusEnum, Prisma } from 'generated/prisma';

import app from '@app/app';
import { ErrorCodes } from '@app/config';
import prisma from '@app/lib/prisma';
import OrderRepository from '@app/repositories/order.repository';
import ProductRepository from '@app/repositories/product.repository';

import CartRepository from '@repository/cart.repository';

export default class OrderService {
  private readonly _cartRepository: CartRepository;
  private readonly _productRepository: ProductRepository;
  private readonly _orderRepository: OrderRepository;

  constructor() {
    this._cartRepository = new CartRepository();
    this._productRepository = new ProductRepository();
    this._orderRepository = new OrderRepository();
  }

  async createOrderWithCardItems(
    orderRequest: CreateOrderRequestType,
    userId: string
  ): Promise<ResultType<CreateOrderResultType>> {
    try {
      return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const cartResult = await this._cartRepository.getCartsByIds(orderRequest.cartIds, userId);

          if (cartResult.carts.length === 0 || cartResult.carts.length !== orderRequest.cartIds.length) {
            return {
              success: false,
              code: ErrorCodes.CART_NOT_FOUND,
              message: 'No carts found',
            };
          }

          // Maximum order amount is 99,999,999 VND
          if (cartResult.totalPrice > 99999999) {
            return {
              success: false,
              code: ErrorCodes.TOTAL_PRICE_IS_TOO_HIGH,
              message: 'Total price is too high',
            };
          }

          for (const item of cartResult.carts) {
            if (item.quantity > item.product.quantity) {
              return {
                success: false,
                code: ErrorCodes.QUANTITY_IS_NOT_ENOUGH,
                message: 'Product quantity is not enough',
              };
            }
          }

          const order = await this._orderRepository.createOrderWithCartItems(
            tx,
            cartResult.carts,
            orderRequest,
            cartResult.totalPrice,
            userId
          );
          await this._cartRepository.deleteManyCart(orderRequest.cartIds);

          return {
            success: true,
            message: 'Order created successfully',
            data: order,
          };
        },
        {
          maxWait: 10000,
          timeout: 100000,
        }
      );
    } catch (error) {
      app.log.error(`Create order failed: ${error}`);
      return {
        success: false,
        code: ErrorCodes.CREATE_ORDER_FAILED,
        message: 'Create order failed',
      };
    }
  }

  async createOrderWithChat(orderRequest: CreateOrderWithChatType): Promise<ResultType<CreateOrderResultType>> {
    try {
      return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const product = await this._productRepository.getProductForCreateOrder(orderRequest.productId);

          if (product.quantity < orderRequest.count) {
            return {
              success: false,
              code: ErrorCodes.QUANTITY_IS_NOT_ENOUGH,
              message: 'Product quantity is not enough',
            };
          }

          const totalAmount = Number(product.price * orderRequest.count);

          // Maximum order amount is 99,999,999 VND
          if (totalAmount > 99999999) {
            return {
              success: false,
              code: ErrorCodes.TOTAL_PRICE_IS_TOO_HIGH,
              message: 'Total price is too high',
            };
          }

          const order = await this._orderRepository.createOrder(tx, product, orderRequest, totalAmount);

          return {
            success: true,
            message: 'Order created successfully',
            data: order,
          };
        },
        {
          maxWait: 10000,
          timeout: 100000,
        }
      );
    } catch (error) {
      app.log.error(`Create order failed: ${error}`);
      return {
        success: false,
        code: ErrorCodes.CREATE_ORDER_FAILED,
        message: 'Create order failed',
      };
    }
  }
  async updateOrderStatus(orderId: string, orderStatus: OrderStatusEnum): Promise<ResultType<void>> {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const currentOrder = await this.getOrderById(orderId);

      if (orderStatus === OrderStatusEnum.COMPLETED && currentOrder.orderStatus !== OrderStatusEnum.COMPLETED) {
        const orderDetail = await this._orderRepository.getOrderDetail(orderId);

        for (const item of orderDetail) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });

          if (!product || product.quantity < item.quantity) {
            throw new Error(`Product ${item.productId} is out of stock or not enough quantity`);
          }
          await this._productRepository.updateQuantity(tx, item.productId, item.quantity, 'decrement');
        }
      }

      if (orderStatus === OrderStatusEnum.FAILED && currentOrder.orderStatus === OrderStatusEnum.COMPLETED) {
        const orderDetail = await this._orderRepository.getOrderDetail(orderId);

        for (const item of orderDetail) {
          await this._productRepository.updateQuantity(tx, item.productId, item.quantity, 'increment');
        }
      }

      await this._orderRepository.updateOrderStatus(orderId, orderStatus);

      return {
        success: true,
        message: 'Order updated successfully',
      };
    });
  }

  async addPaymentIntent(orderId: string, paymentIntentId: string, clientSecret: string): Promise<Order> {
    return await this._orderRepository.addPaymentIntent(orderId, paymentIntentId, clientSecret);
  }

  async getOrderById(orderId: string): Promise<Order> {
    return await this._orderRepository.getOrderById(orderId);
  }

  async getOrdersByUserId(userId: string, filter: OrderFilterType): Promise<ResultType<ListOrderResponseType>> {
    try {
      const orders = await this._orderRepository.getOrdersByUserId(userId, filter);

      return {
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      app.log.error(`Get orders by user id failed: ${error}`);
      return {
        success: false,
        code: ErrorCodes.GET_ORDERS_BY_USER_ID_FAILED,
        message: 'Get orders by user id failed',
      };
    }
  }
}
