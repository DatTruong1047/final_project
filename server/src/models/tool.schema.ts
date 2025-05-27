import { z } from 'zod';

import { ProductMetadataSchema } from './product.schema';

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
});

export const ProductSearchQuerySchema = FullTextQuerySchema.extend({
  query: z
    .string({
      required_error: 'Query is required',
      invalid_type_error: 'Query must be a string',
    })
    .min(1)
    .describe(
      'The query to search for, this can be a product name or a part of the product name, if not provided, the search will be based on the full text query'
    ),
});

export const ProductSearchOutputSchema = z.object({
  products: z.array(ProductMetadataSchema),
  total: z.number(),
});

export const ProductComparisonInputSchema = z.object({
  productNames: z.array(z.string()).describe('The names of the products to compare'),
  // comparisonCriteria: z.string().optional().describe('The criteria of the comparison, not required'),
});

export const CreateOrderWithChatSchema = z.object({
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
  productId: z
    .string({
      required_error: 'Product ID is required',
      invalid_type_error: 'Product ID must be a string',
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

export const ProductComparisonOutputSchema = z.object({
  productNames: z.array(z.string()).describe('The names of the products to compare'),
  notFoundProductNames: z.array(z.string()).describe('The names of the products that were not found'),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        values: z.array(z.string()),
      })
    )
    .describe('The attributes of the products to compare'),
  // comparisonCriteria: z.string().describe('The criteria of the comparison, not required'),
});

export const StructuredErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  success: z.boolean(),
});

export type ProductSearchQueryType = z.infer<typeof ProductSearchQuerySchema>;
export type FullTextQueryType = z.infer<typeof FullTextQuerySchema>;
export type ProductSearchOutputType = z.infer<typeof ProductSearchOutputSchema>;

export type CreateOrderWithChatType = z.infer<typeof CreateOrderWithChatSchema>;

export type ProductComparisonInputType = z.infer<typeof ProductComparisonInputSchema>;
export type ProductComparisonOutputType = z.infer<typeof ProductComparisonOutputSchema>;
