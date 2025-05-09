import type { ForgotPasswordRequestType, LoginRequestType, RegisterUserRequestType, ResetPasswordRequestType } from '@/types/authType'
import axiosInstance from '@/helpers/axios'

export const register = (data: RegisterUserRequestType) => axiosInstance.post('/auth/sign-up', data)
export const login = (data: LoginRequestType) => axiosInstance.post('/auth/sign-in', data)
export const forgotPassword = (data: ForgotPasswordRequestType) => axiosInstance.post('/auth/forgot-password', data)
export const resetPassword = (data: ResetPasswordRequestType) => axiosInstance.post('/auth/reset-password', data)
