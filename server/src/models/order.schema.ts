import { z } from 'zod';
import { PaymentSchema } from './payment.schema';
import { OrderStatusEnum } from 'generated/prisma';

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
  note: z.string().optional(),
  phoneNumber: z.string().min(10).max(15),
});

export const CreateOrderResultSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phoneNumber: z.string().min(10).max(15),
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
      clientSecret: z.string(),
    })
    .optional(),
});

export type CreateOrderRequestType = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderResultType = z.infer<typeof CreateOrderResultSchema>;

export type OrderBaseType = z.infer<typeof OrderBaseSchema>;

export type OrderDetailType = z.infer<typeof OrderDetailSchema>;

export type OrderResponseType = z.infer<typeof OrderResponseSchema>;
