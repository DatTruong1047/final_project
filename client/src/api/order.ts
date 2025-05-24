import axiosInstance from '@/helpers/axios'
import type { CreateOrderType } from '@/types/orderType'

export const getOrders = async () => axiosInstance.get('/order')

export const createOrder = async (order: CreateOrderType) => axiosInstance.post('/order', order)
