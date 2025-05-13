import { ProductSort, ProductSortBy } from '@/types/productType'
import * as yup from 'yup'

export const ProductBaseSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  code: yup.string().required(),
  shortDescription: yup.string().nullable(),
  longDescription: yup.string().nullable(),
  price: yup.number().required(),
  quantity: yup.number().required(),
  categoryId: yup.string().required(),
  category: yup
    .object({
      id: yup.string().required(),
      name: yup.string().required(),
    })
    .required(),
  brandId: yup.string().required(),
  brand: yup
    .object({
      id: yup.string().required(),
      name: yup.string().required(),
    })
    .required(),
  attributes: yup
    .array(
      yup.object({
        attributeKey: yup.string().required(),
        attributeValue: yup.string().required(),
      }),
    )
    .required(),
  productMedias: yup
    .array(
      yup.object({
        id: yup.string().required(),
        media: yup
          .object({
            id: yup.string().required(),
            url: yup.string().required(),
          })
          .required(),
      }),
    )
    .required(),
})

export const ProductListSchema = yup.object({
  products: yup
    .array(
      ProductBaseSchema.omit(['longDescription', 'attributes', 'quantity', 'productMedias']).shape({
        thumbnail: yup
          .object({
            id: yup.string().required(),
            media: yup
              .object({
                id: yup.string().required(),
                url: yup.string().required(),
                description: yup.string().nullable(),
              })
              .required(),
          })
          .required(),
      }),
    )
    .required(),
  total: yup.number().required(),
  page: yup.number().default(1),
  limit: yup.number().default(8),
})

export const ProductDetailSchema = ProductBaseSchema.shape({
  reviews: yup.array(
    yup.object({
      id: yup.string().required(),
      rating: yup.number().required(),
      comment: yup.string().required(),
      createdAt: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
  ),
})

export const ProductFilterSchema = yup.object({
  page: yup
    .number()
    .transform((value, originalValue) => {
      const parsed = parseInt(originalValue, 10)
      return isNaN(parsed) ? 1 : parsed
    })
    .min(1)
    .default(1),
  limit: yup
    .number()
    .transform((value, originalValue) => {
      const parsed = parseInt(originalValue, 10)
      return isNaN(parsed) ? 8 : parsed
    })
    .min(1)
    .default(8),
  brandId: yup.string(),
  categoryId: yup.string(),
  searchText: yup.string().default(''),
  sortOrder: yup.string().oneOf([ProductSort.ASC, ProductSort.DESC]).default(ProductSort.DESC),
  sortBy: yup
    .string()
    .oneOf([ProductSortBy.CREATED_AT, ProductSortBy.PRICE])
    .default(ProductSortBy.CREATED_AT),
})
