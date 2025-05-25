import {
  CreateOrderRequestType,
  CreateOrderResultType,
  CreateOrderWithChatType,
  OrderResponseType,
  ResultType,
} from '@model';

import { ErrorCodes } from '@app/config';
import ProductRepository from '@app/repositories/product.repository';

import CartRepository from '@repository/cart.repository';
import OrderRepository from '@app/repositories/order.repository';

import prisma from '@app/lib/prisma';
import { Order, OrderStatusEnum, Prisma } from 'generated/prisma';
import app from '@app/app';

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
    req: CreateOrderRequestType,
    userId: string
  ): Promise<ResultType<CreateOrderResultType>> {
    try {
      return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const cartResult = await this._cartRepository.getCartsByIds(req.cartIds, userId);

          if (cartResult.carts.length === 0 || cartResult.carts.length !== req.cartIds.length) {
            return {
              success: false,
              code: ErrorCodes.CART_NOT_FOUND,
              message: 'No carts found',
            };
          }

          // Maximum order amount is 99,999,999 VND
          if(cartResult.totalPrice > 99999999 ) {
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
            req,
            cartResult.totalPrice,
            userId
          );
          await this._cartRepository.deleteManyCart(req.cartIds);

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

  async createOrderWithChat(req: CreateOrderWithChatType): Promise<ResultType<CreateOrderResultType>> {
    try {
      return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const product = await this._productRepository.getProductForCreateOrder(req.productName);
          if (!product) {
            return {
              success: false,
              code: ErrorCodes.PRODUCT_NOT_FOUND,
              message: 'Product not found',
            };
          }

          if (product.quantity < req.count) {
            return {
              success: false,
              code: ErrorCodes.QUANTITY_IS_NOT_ENOUGH,
              message: 'Product quantity is not enough',
            };
          }

          const totalAmount = Number(product.price * req.count);

          // Maximum order amount is 99,999,999 VND
          if(totalAmount > 99999999) {
            return {
              success: false,
              code: ErrorCodes.TOTAL_PRICE_IS_TOO_HIGH,
              message: 'Total price is too high',
            };
          }

          const order = await this._orderRepository.createOrder(tx, product, req, totalAmount);

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
  async updateOrderStatus(orderId: string, orderStatus: OrderStatusEnum) {
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


  async addPaymentIntent(orderId: string, paymentIntentId: string, clientSecret: string) {
    return await this._orderRepository.addPaymentIntent(orderId, paymentIntentId, clientSecret);
  }

  async getOrderById(orderId: string): Promise<Order> {
    return await this._orderRepository.getOrderById(orderId);
  }

  async getOrdersByUserId(userId: string): Promise<OrderResponseType[]> {
    const orders = await this._orderRepository.getOrdersByUserId(userId);

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      phoneNumber: order.phoneNumber,
      note: order.note,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount.toString(),
      orderDate: order.orderDate,
      orderDetails: order.orderDetails.map((detail) => ({
        id: detail.id,
        productId: detail.productId,
        productName: detail.productName,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        subTotal: detail.subTotal,
      })),
      paymentIntent: order.paymentIntent
        ? {
            id: order.paymentIntent.id,
            clientSecret: order.paymentIntent.clientSecret,
          }
        : undefined,
    }));
  }
}
