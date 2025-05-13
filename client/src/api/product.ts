import type { ProductFilterType, ProductListType, ProductDetailType } from '@/types/productType'
import axiosInstance from '@/helpers/axios'

export const getProducts = async (filter: ProductFilterType) =>
  axiosInstance.get('/products', { params: filter })

export const getProductDetail = async (id: string) => axiosInstance.get(`/products/${id}`)
