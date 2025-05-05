import { LoginRequestSchema, RegisterRequestSchema } from '@/validations/auth'

import * as Yup from 'yup'

export type RegisterUserRequestType = Yup.InferType<typeof RegisterRequestSchema>
export type LoginRequestType = Yup.InferType<typeof LoginRequestSchema>
