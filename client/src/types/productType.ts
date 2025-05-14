import type {
  ProductDetailSchema,
  ProductFilterSchema,
  ProductListSchema,
} from '@/validations/product'
import * as yup from 'yup'

export type ProductFilterType = yup.InferType<typeof ProductFilterSchema>
export type ProductListType = yup.InferType<typeof ProductListSchema>
export type ProductDetailType = yup.InferType<typeof ProductDetailSchema>

export enum ProductSort {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
}
