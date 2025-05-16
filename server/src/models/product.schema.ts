import { z } from 'zod';

export const ProductBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  shortDescription: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  price: z.number(),
  quantity: z.number(),
  categoryId: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  brandId: z.string(),
  brand: z.object({
    id: z.string(),
    name: z.string(),
  }),
  attributes: z.array(
    z.object({
      attributeKey: z.string(),
      attributeValue: z.string(),
    })
  ),
  productMedias: z.array(
    z.object({
      id: z.string(),
      media: z.object({
        id: z.string(),
        url: z.string(),
      }),
    })
  ),
});

export const ProductListSchema = z.object({
  products: z.array(
    ProductBaseSchema.omit({
      longDescription: true,
      attributes: true,
      quantity: true,
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
    })
  ),
  total: z.number(),
  page: z.number().default(1),
  limit: z.number().default(8),
});

export const ProductDetailSchema = ProductBaseSchema.extend({
  reviews: z
    .array(
      z.object({
        id: z.string(),
        rating: z.number(),
        comment: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    )
    .optional(),
});

export const ProductFilterSchema = z.object({
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
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  searchText: z.string().optional(),
  minPrice: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 0 : num;
    }, z.number().min(0).default(0))
    .optional(),
  maxPrice: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 1000000000 : num;
    }, z.number().min(0).default(1000000000))
    .optional(),
  sortBy: z.enum(['price', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ProductFilterType = z.infer<typeof ProductFilterSchema>;

export type ProductBaseType = z.infer<typeof ProductBaseSchema>;
export type ProductListType = z.infer<typeof ProductListSchema>;
export type ProductDetailType = z.infer<typeof ProductDetailSchema>;
