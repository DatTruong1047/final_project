import {
  CreateOrderRequestType,
  CartDetailType,
  CreateOrderResultType,
  CreateOrderWithChatType,
  ProductForCreateOrderType,
  OrderFilterType,
  ListOrderResponseType,
} from '@model';
import { OrderStatusEnum, Prisma, PrismaClient, Order, OrderDetail } from 'generated/prisma';

import prisma from '@app/lib/prisma';

export default class OrderRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async createOrderWithCartItems(
    tx: Prisma.TransactionClient,
    cartItems: CartDetailType[],
    req: CreateOrderRequestType,
    totalAmount: number,
    userId: string
  ): Promise<CreateOrderResultType> {
    const result = await tx.order.create({
      data: {
        userId: userId,
        fullName: req.fullname,
        address: req.address,
        phoneNumber: req.phoneNumber,
        note: req.note,
        totalAmount: totalAmount,
        orderDate: new Date(),
        orderStatus: OrderStatusEnum.CREATED,
        orderDetails: {
          create: cartItems.map((c) => ({
            product: {
              connect: {
                id: c.product.id,
              },
            },
            productName: c.product.name,
            quantity: c.quantity,
            unitPrice: c.product.price,
            subtotal: (c.product.price * c.quantity).toString(),
          })),
        },
      },
      select: this._createOrderSelectBase,
    });

    return {
      ...result,
      totalAmount: result.totalAmount.toString(),
      orderDate: result.orderDate.toISOString(),
      orderStatus: result.orderStatus as OrderStatusEnum,
      orderDetails: result.orderDetails.map((detail) => ({
        ...detail,
        unitPrice: Number(detail.unitPrice),
        subTotal: Number(detail.subtotal),
      })),
    };
  }

  async createOrder(
    tx: Prisma.TransactionClient,
    product: ProductForCreateOrderType,
    req: CreateOrderWithChatType,
    totalAmount: number
  ): Promise<CreateOrderResultType> {
    try {
      const result = await tx.order.create({
        data: {
          userId: req.userId,
          phoneNumber: req.phoneNumber,
          fullName: req.fullname,
          address: req.address,
          note: req.note || '',
          totalAmount: Number(totalAmount),
          orderDate: new Date(),
          orderStatus: OrderStatusEnum.CREATED,
          orderDetails: {
            create: {
              product: {
                connect: { id: product.id },
              },
              productName: product.name,
              quantity: req.count,
              unitPrice: Number(product.price),
              subtotal: Number(product.price * req.count).toFixed(2),
            },
          },
        },
        select: this._createOrderSelectBase,
      });

      return {
        ...result,
        totalAmount: result.totalAmount.toString(),
        orderDate: result.orderDate.toISOString(),
        orderStatus: result.orderStatus as OrderStatusEnum,
        orderDetails: result.orderDetails.map((detail) => ({
          ...detail,
          unitPrice: Number(detail.unitPrice),
          subTotal: Number(detail.subtotal),
        })),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, orderStatus: OrderStatusEnum): Promise<Order> {
    return this._prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: orderStatus },
    });
  }

  async addPaymentIntent(orderId: string, paymentIntentId: string, clientSecret: string): Promise<Order> {
    return this._prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: paymentIntentId, clientSecret: clientSecret },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this._prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async getOrderList(userId: string): Promise<Order[]> {
    return this._prisma.order.findMany({
      where: { userId },
    });
  }

  async getOrdersByUserId(userId: string, filter: OrderFilterType): Promise<ListOrderResponseType> {
    const orders = await this._prisma.order.findMany({
      where: { userId, ...(filter.status && { orderStatus: filter.status }) },
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      orderBy: { updatedAt: 'desc' },
      select: this._createOrderSelectBase,
    });

    const total = await this._prisma.order.count({
      where: { userId, ...(filter.status && { orderStatus: filter.status }) },
    });

    const response: ListOrderResponseType = {
      orders: orders.map((order) => ({
        ...order,
        totalAmount: order.totalAmount.toString(),
        orderDate: order.orderDate.toISOString(),
        orderDetails: order.orderDetails.map((detail) => ({
          ...detail,
          unitPrice: Number(detail.unitPrice),
          subTotal: Number(detail.subtotal),
        })),
        paymentIntent: order.paymentIntentId
          ? {
              id: order.paymentIntentId,
              clientSecret: order.clientSecret,
            }
          : undefined,
      })),
      page: filter.page,
      limit: filter.limit,
      totalOrders: total,
      totalPages: Math.ceil(total / filter.limit),
    };

    return response;
  }

  async getOrderDetail(orderId: string): Promise<OrderDetail[]> {
    return this._prisma.orderDetail.findMany({
      where: { orderId },
    });
  }

  private readonly _createOrderSelectBase = {
    id: true,
    userId: true,
    phoneNumber: true,
    orderDate: true,
    note: true,
    totalAmount: true,
    orderStatus: true,
    orderDetails: {
      select: {
        id: true,
        productId: true,
        productName: true,
        quantity: true,
        unitPrice: true,
        subtotal: true,
      },
    },
    clientSecret: true,
    paymentIntentId: true,
  };
}
