import axiosInstance from '@/helpers/axios'
import type { CreateOrderType, OrderFilterType } from '@/types/orderType'

export const getOrders = async  (filter: OrderFilterType) => axiosInstance.get('/order', { params: filter })

export const createOrder = async (order: CreateOrderType) => axiosInstance.post('/order', order)
