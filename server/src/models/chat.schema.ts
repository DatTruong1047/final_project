import { z } from 'zod';
import { CreateOrderRequestSchema } from './order.schema';

export const ChatQuerySchema = z.object({
  query: z
    .string({
      required_error: 'Query is required',
      invalid_type_error: 'Query must be a string',
    })
    .min(1),
});

export const ProductMetadataSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  image: z.array(z.string()).nullish(),
  short_description: z.string().nullish(),
  price: z.number().nullish(),
  category_name: z.string().nullish(),
  brand_name: z.string().nullish(),
  attributes: z.record(z.string()).nullish(),
  summary: z.string().nullish(),
});

export const ChatResponseSchema = z.object({
  query: z.string().min(1),
  response: z.array(
    z.object({
      metadata: ProductMetadataSchema
    })
  ),
});

export const ChatMessageResponseSchema = z.object({
  query: z.string().min(1),
  response: z.string().min(1),
});

export const FullTextQuerySchema = z.object({
  product_name: z.string().min(1).nullish(),
  category_name: z.string().min(1).nullish(),
  brand_name: z.string().min(1).nullish(),
  price_min: z.number().nullish().default(0),
  price_max: z.number().nullish().default(1000000000),
  attributes_values: z.array(z.string()).nullish(),
  limit: z.number().nullish().default(10),
});

export const ProductSearchQuerySchema = FullTextQuerySchema.extend({
  query: z.string({
    required_error: 'Query is required',
    invalid_type_error: 'Query must be a string',
  }).min(1),
});


export const CreateOrderWithChatSchema = CreateOrderRequestSchema.omit({
  cartIds: true,
})
.extend({
  productName: z.string({
    required_error: 'Product name is required',
    invalid_type_error: 'Product name must be a string',
  }).min(1),
  userId: z.string({
    required_error: 'User ID is required',
    invalid_type_error: 'User ID must be a string',
  }),
  count: z.number({
    required_error: 'Count is required',
    invalid_type_error: 'Count must be a number',
  }).min(1),
});

export type CreateOrderWithChatType = z.infer<typeof CreateOrderWithChatSchema>;

export type ChatQueryType = z.infer<typeof ChatQuerySchema>;
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;
export type ChatMessageResponseType = z.infer<typeof ChatMessageResponseSchema>;

export type ProductMetadataType = z.infer<typeof ProductMetadataSchema>;
export type ProductSearchQueryType = z.infer<typeof ProductSearchQuerySchema>;

export type FullTextQueryType = z.infer<typeof FullTextQuerySchema>;
