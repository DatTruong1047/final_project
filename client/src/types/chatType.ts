import type { ChatResponseSchema, ChatSchema } from "@/validations/chat"
import Yup from 'yup'

export type ChatRequestType = Yup.InferType<typeof ChatSchema>
export type ChatResponseType = Yup.InferType<typeof ChatResponseSchema>
