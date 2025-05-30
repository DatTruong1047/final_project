import axiosInstance from '@/helpers/axios'
import type {
  ChatRequestType,
  CreateSessionRequestType,
  MergeChatSessionRequestType,
} from '@/types/chatType'

export const sendMessage = (data: ChatRequestType) => axiosInstance.post('/chat/message', data)
export const createSession = (data: CreateSessionRequestType, anonymousId?: string) =>
  axiosInstance.post('/chat/session', { ...data }, { headers: { 'x-anonymous-id': anonymousId } })
export const endSession = (id: string) => axiosInstance.delete(`/chat/session/${id}`)
export const getChatHistory = (id: string) =>
  axiosInstance.get(`/chat/session/${id}/messages`, { params: { orderBy: 'desc' } })
export const mergeSession = (data: MergeChatSessionRequestType) =>
  axiosInstance.post('/chat/merge-chat-session', data)
