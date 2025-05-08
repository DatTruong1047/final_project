import type { LoginRequestType, RegisterUserRequestType } from '@/types/authType'
import axiosInstance from '@/helpers/axios'

export const register = (data: RegisterUserRequestType) => axiosInstance.post('/auth/sign-up', data)
export const login = (data: LoginRequestType) => axiosInstance.post('/auth/sign-in', data)
