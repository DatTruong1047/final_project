import type { orderSchema, createOrderSchema } from '@/validations/order'
import yup from 'yup'

export type OrderBaseType = yup.InferType<typeof orderSchema>
export type CreateOrderType = yup.InferType<typeof createOrderSchema>
