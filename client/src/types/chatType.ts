import type { ChatMessageSchema, ChatMessagesResponseSchema, ChatQuerySchema, ChatSessionResponseSchema, CreateSessionSchema, MergeChatSessionSchema } from "@/validations/chat"
import Yup from 'yup'

export type ChatRequestType = Yup.InferType<typeof ChatQuerySchema>
export type ChatResponseType = Yup.InferType<typeof ChatSessionResponseSchema>
export type CreateSessionRequestType = Yup.InferType<typeof CreateSessionSchema>
export type MergeChatSessionRequestType = Yup.InferType<typeof MergeChatSessionSchema>
export type ChatMessageType = Yup.InferType<typeof ChatMessageSchema>
export type ChatMessagesResponseType = Yup.InferType<typeof ChatMessagesResponseSchema>
