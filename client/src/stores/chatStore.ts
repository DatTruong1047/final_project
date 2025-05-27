import { createSession, endSession, sendMessage, getChatHistory } from '@/api/chat'
import type { ChatMessageType } from '@/types/chatType'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

interface ChatState {
  messages: ChatMessageType[]
  isLoading: boolean
  isShowChat: boolean
  isError: boolean
  sessionId: string
  anonymousId: string
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [
      {
        id: new Date().toISOString(),
        content: 'Xin chào, tôi là trợ lý của bạn. Tôi có thể giúp bạn tìm kiếm sản phẩm tốt nhất.',
        role: 'assistant',
        sessionId: '',
        createdAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isShowChat: false,
    isError: false,
    sessionId: '',
    anonymousId: localStorage.getItem('anonymousId') || '',
  }),
  actions: {
    async createSession(userId: string | null) {
      if (!userId) {
        if (!this.anonymousId) {
          this.anonymousId = uuidv4()
          localStorage.setItem('anonymousId', this.anonymousId)
        }
        const response = await createSession({ userId: null }, this.anonymousId)
        this.sessionId = response.data.id
        localStorage.setItem('sessionId', this.sessionId)
      } else {
        const response = await createSession({ userId })
        this.sessionId = response.data.id
        localStorage.setItem('sessionId', this.sessionId)
      }
    },

    async clearSession() {
      await endSession(this.sessionId)
      this.sessionId = ''
      this.messages = [
        {
          id: new Date().toISOString(),
          content:
            'Xin chào, tôi là trợ lý của bạn. Tôi có thể giúp bạn tìm kiếm sản phẩm tốt nhất.',
          role: 'assistant',
          sessionId: '',
          createdAt: new Date().toISOString(),
        },
      ]
    },


    toggleChat() {
      this.isShowChat = !this.isShowChat
    },

    async getMessages(sessionId: string) {
      const response = await getChatHistory(sessionId)
      const messages = response.data.chatMessages.sort((a: ChatMessageType, b: ChatMessageType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      this.messages = messages
    },

    async addMessage(message: ChatMessageType) {
      this.messages.push(message)
    },

    async sendUserMessage(content: string) {
      try {
        this.isLoading = true
        const response = await sendMessage({ sessionId: this.sessionId, content })
        console.log(response)

        if (!response.data.chatMessages) {
          this.isError = true
          this.messages.push({
            id: new Date().toISOString(),
            content: 'Xin lỗi, hệ thống đang bảo trì, vui lòng thử lại sau.',
            role: 'Assistant',
            sessionId: '',
            createdAt: new Date().toISOString(),
          })
        }
        this.messages.push({
          id: response.data.chatMessages[0].id || '',
          content: response.data.chatMessages[0].content || '',
          role: 'Assistant',
          sessionId: this.sessionId,
          createdAt: response.data.chatMessages[0].createdAt,
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
