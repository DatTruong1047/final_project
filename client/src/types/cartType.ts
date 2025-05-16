import {
  CartDetailSchema,
  CartListSchema,
  CartBaseSchema,
  CartUpsertRequestSchema,
  CartUpdateRequestSchema,
} from '@/validations/cart'
import * as yup from 'yup'

export type CartDetailType = yup.InferType<typeof CartDetailSchema>
export type CartListType = yup.InferType<typeof CartListSchema>
export type CartBaseType = yup.InferType<typeof CartBaseSchema>
export type CartUpsertRequestType = yup.InferType<typeof CartUpsertRequestSchema>
export type CartUpdateRequestType = yup.InferType<typeof CartUpdateRequestSchema>
