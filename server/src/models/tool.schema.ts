import { z } from 'zod';
import { CreateOrderRequestSchema } from './order.schema';

export const ProductComparisonInputSchema = z.object({
  productNames: z.array(z.string()),
  comparisonCriteria: z.string().optional(),
});

export const FullTextQuerySchema = z.object({
  productName: z
    .string()
    .min(1)
    .nullish()
    .describe(
      'The name of the product to search for, this can be a product name or a part of the product name, not required'
    ),
  categoryName: z.string().min(1).nullish().describe('The name of the category to search for, not required'),
  brandName: z.string().min(1).nullish().describe('The name of the brand to search for, not required'),
  priceMin: z.number().nullish().default(0).describe('The minimum price to search for, not required'),
  priceMax: z.number().nullish().default(1000000000).describe('The maximum price to search for, not required'),
  attributesValues: z.array(z.string()).nullish().describe('The values of the attributes to search for, not required'),
  limit: z.number().nullish().default(10).describe('The maximum number of products to return, not required'),
});

export const ProductSearchQuerySchema = FullTextQuerySchema.extend({
  query: z
    .string({
      required_error: 'Query is required',
      invalid_type_error: 'Query must be a string',
    })
    .min(1),
});

export const CreateOrderWithChatSchema = CreateOrderRequestSchema.omit({
  cartIds: true,
}).extend({
  productName: z
    .string({
      required_error: 'Product name is required',
      invalid_type_error: 'Product name must be a string',
    })
    .min(1),
  userId: z.string({
    required_error: 'User ID is required',
    invalid_type_error: 'User ID must be a string',
  }),
  count: z
    .number({
      required_error: 'Count is required',
      invalid_type_error: 'Count must be a number',
    })
    .min(1),
});

export type ProductSearchQueryType = z.infer<typeof ProductSearchQuerySchema>;

export type FullTextQueryType = z.infer<typeof FullTextQuerySchema>;
export type ProductComparisonInputType = z.infer<typeof ProductComparisonInputSchema>;
