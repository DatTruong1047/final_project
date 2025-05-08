import { ForgotPasswordRequestSchema, LoginRequestSchema, RegisterRequestSchema, ResetPasswordRequestSchema } from '@/validations/auth'

import * as Yup from 'yup'

export type RegisterUserRequestType = Yup.InferType<typeof RegisterRequestSchema>
export type LoginRequestType = Yup.InferType<typeof LoginRequestSchema>
export type ForgotPasswordRequestType = Yup.InferType<typeof ForgotPasswordRequestSchema>
export type ResetPasswordRequestType = Yup.InferType<typeof ResetPasswordRequestSchema>
