import { z } from 'zod';

import { ProductBaseSchema } from './product.schema';

export const CartBaseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  userId: z.string(),
  product: ProductBaseSchema.omit({
    attributes: true,
    shortDescription: true,
    longDescription: true,
    productMedias: true,
  }).extend({
    thumbnail: z.object({
      id: z.string(),
      media: z
        .object({
          id: z.string(),
          url: z.string(),
          description: z.string().optional().nullable(),
        })
        .nullable(),
    }),
  }),
  totalPrice: z.number().optional(),
});

export const CartListSchema = z.object({
  carts: z.array(CartBaseSchema),
  total: z.number(),
  totalPrice: z.number(),
});

export const CartDetailSchema = CartBaseSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const CartUpsertRequestSchema = z.object({
  productId: z.string({
    required_error: 'Product ID is required',
    invalid_type_error: 'Product ID must be a string',
  }),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      invalid_type_error: 'Quantity must be a number',
    })
    .int()
    .positive()
    .min(1, 'Quantity at least 1'),
});

export const CartUpdateRequestSchema = z.object({
  id: z.string(),
  count: z
    .number({
      required_error: 'Count is required',
      invalid_type_error: 'Count must be a number',
    })
    .int()
    .positive()
    .min(1, 'Count at least 1'),
});

export const CartCheckSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});

export type CartBaseType = z.infer<typeof CartBaseSchema>;
export type CartListType = z.infer<typeof CartListSchema>;
export type CartDetailType = z.infer<typeof CartDetailSchema>;
export type CartUpsertRequestType = z.infer<typeof CartUpsertRequestSchema>;
export type CartCheckType = z.infer<typeof CartCheckSchema>;
export type CartUpdateRequestType = z.infer<typeof CartUpdateRequestSchema>;
