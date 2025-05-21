import axiosInstance from '@/helpers/axios'
import type { ChatRequestType, ChatResponseType } from '@/types/chatType'

export const sendMessage = (data: ChatRequestType) => axiosInstance.post('/chat/message', data)
export const getChatHistory = () => axiosInstance.get('/chat/history')
