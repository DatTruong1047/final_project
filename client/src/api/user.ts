import axiosInstance from '@/helpers/axios'

export const getProfile = () => axiosInstance.get('/user/profile')
