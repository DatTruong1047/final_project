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

export const ProductForCreateOrderSchema = ProductBaseSchema.omit({
  category: true,
  brand: true,
  attributes: true,
  productMedias: true,
  brandId: true,
  categoryId: true,
  longDescription: true,
  shortDescription: true,
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

export const ProductComparisonSchema = z.object({
  productNames: z.array(z.string()).describe('The names of the products to compare').min(2).max(5),
});

export type ProductComparisonInputType = z.infer<typeof ProductComparisonSchema>;

export const ProductSearchSchema = z.object({
  query: z
    .string()
    .describe(
      'Từ khóa hoặc câu mô tả chung về sản phẩm cần tìm kiếm (ví dụ: "điện thoại thông minh", "máy giặt cửa ngang", "tai nghe bluetooth"). Bắt buộc phải có. Có thể suy ra từ câu hỏi của người dùng.'
    ),
  productName: z
    .string()
    .describe('Tên sản phẩm cụ thể hoặc một phần của tên sản phẩm. Phân tích từ khóa tìm kiếm của người dùng để tìm tên sản phẩm phù hợp.')
    .default(''),
  categoryName: z
    .string()
    .describe('Tên danh mục sản phẩm (ví dụ: "Điện thoại", "Tủ lạnh", "Tivi", "Máy giặt"). Phân tích từ khóa tìm kiếm của người dùng để tìm danh mục sản phẩm phù hợp.')
    .optional(),
  brandName: z.string().describe('Tên thương hiệu của sản phẩm (ví dụ: "Samsung", "Apple", "LG"). Phân tích từ khóa tìm kiếm của người dùng để tìm thương hiệu sản phẩm phù hợp.').optional(),
  priceMin: z.number().describe('Giá tối thiểu của sản phẩm.').min(0).default(0).optional(),
  priceMax: z.number().describe('Giá tối đa của sản phẩm.').min(0).default(1000000000).optional(),
  attributesValues: z
    .array(z.string())
    .describe(
      'Các giá trị của thuộc tính kỹ thuật của sản phẩm (ví dụ: "8GB", "6.5 inch", "256GB", "1000W", "Android", "15kg").'
    )
    .default([])
    .optional(),
});

export type ProductSearchQueryType = z.infer<typeof ProductSearchSchema>;

export type ProductMetadataType = z.infer<typeof ProductMetadataSchema>;
export type ProductFilterType = z.infer<typeof ProductFilterSchema>;

export type ProductBaseType = z.infer<typeof ProductBaseSchema>;
export type ProductListType = z.infer<typeof ProductListSchema>;
export type ProductDetailType = z.infer<typeof ProductDetailSchema>;
export type ProductForCreateOrderType = z.infer<typeof ProductForCreateOrderSchema>;
