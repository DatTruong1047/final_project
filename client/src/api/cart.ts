import axiosInstance from '@/helpers/axios'
import type { CartUpdateRequestType, CartUpsertRequestType } from '@/types/cartType'

export const addToCart = (data: CartUpsertRequestType) => axiosInstance.post('/cart', data)
export const getCarts = () => axiosInstance.get('/cart')
export const updateCart = (data: CartUpdateRequestType) => axiosInstance.put('/cart', data)
export const removeFromCart = (id: string) => axiosInstance.delete(`/cart/${id}`)
