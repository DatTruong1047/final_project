import { z } from 'zod';

import { OrderStatusEnum } from 'generated/prisma';

import { PaymentSchema } from './payment.schema';

export const OrderDetailSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  subTotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const OrderFilterSchema = z.object({
  page: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 1 : num;
    }, z.number().min(1).default(1))
    .optional(),
  limit: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 8 : num;
    }, z.number().min(1).default(8))
    .optional(),
  status: z.nativeEnum(OrderStatusEnum).optional(),
});

export const OrderBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phoneNumber: z.string().min(10).max(15),
  note: z.string().optional(),
  totalAmount: z.string(),
  orderDate: z.string(),
  orderStatus: z.nativeEnum(OrderStatusEnum),
  orderDetails: z.array(OrderDetailSchema),
  payments: z.array(PaymentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateOrderRequestSchema = z.object({
  cartIds: z.array(z.string()),
  address: z.string({
    required_error: 'Address is required',
    invalid_type_error: 'Address must be a string',
  }),
  fullname: z.string({
    required_error: 'Fullname is required',
    invalid_type_error: 'Fullname must be a string',
  }),
  phoneNumber: z.string().min(10).max(15),
  note: z.string().nullish(),
});

export const CreateOrderResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phoneNumber: z.string().min(1).max(15),
  note: z.string().optional(),
  totalAmount: z.string(),
  orderDate: z.string(),
  orderStatus: z.nativeEnum(OrderStatusEnum),
  orderDetails: z.array(OrderDetailSchema.omit({ orderId: true, createdAt: true, updatedAt: true })),
});

export const OrderResponseSchema = z.object({
  ...CreateOrderResultSchema.shape,
  paymentIntent: z
    .object({
      id: z.string(),
      clientSecret: z.string().nullish(),
    })
    .optional(),
});

export const ListOrderResponseSchema = z.object({
  orders: z.array(OrderResponseSchema),
  page: z.number(),
  limit: z.number(),
  totalOrders: z.number(),
  totalPages: z.number(),
});

export const CreateOrderSchema = z.object({
  address: z.string().describe('The address of the user'),
  fullname: z.string().describe('The fullname of the user'),
  phoneNumber: z.string().describe('The phone number of the user'),
  note: z.string().describe('The note of the user').optional().default(''),
  productName: z.string().describe('The name of the product to order'),
  count: z.number().describe('The count of the product to order').min(1),
});

export type CreateOrderInputType = z.infer<typeof CreateOrderSchema>;

export type CreateOrderRequestType = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderResultType = z.infer<typeof CreateOrderResultSchema>;

export type OrderBaseType = z.infer<typeof OrderBaseSchema>;

export type OrderDetailType = z.infer<typeof OrderDetailSchema>;

export type OrderFilterType = z.infer<typeof OrderFilterSchema>;
export type OrderResponseType = z.infer<typeof OrderResponseSchema>;
export type ListOrderResponseType = z.infer<typeof ListOrderResponseSchema>;
