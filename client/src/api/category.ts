import axiosInstance from '@/helpers/axios'

export const getCategories = async () => axiosInstance.get('/categories')
