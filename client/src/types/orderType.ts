import type { orderSchema, createOrderSchema, OrderFilterSchema } from '@/validations/order'
import yup from 'yup'

export type OrderBaseType = yup.InferType<typeof orderSchema>
export type CreateOrderType = yup.InferType<typeof createOrderSchema>
export type OrderFilterType = yup.InferType<typeof OrderFilterSchema>

export type OrderStatus = 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
