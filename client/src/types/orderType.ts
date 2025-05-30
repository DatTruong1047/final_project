import type { orderSchema, createOrderSchema, OrderFilterSchema, CreateDeliveryInfoSchema } from '@/validations/order'
import yup from 'yup'

export type OrderBaseType = yup.InferType<typeof orderSchema>
export type CreateOrderType = yup.InferType<typeof createOrderSchema>
export type CreateDeliveryInfoType = yup.InferType<typeof CreateDeliveryInfoSchema>
export type OrderFilterType = yup.InferType<typeof OrderFilterSchema>

export type OrderStatus = 'CREATED' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
