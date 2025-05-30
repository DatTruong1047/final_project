import { createSession, endSession, sendMessage, getChatHistory } from '@/api/chat'
import type { ChatAIMessageResponseType, ChatMessageType } from '@/types/chatType'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

interface ChatState {
  messages: ChatMessageType[]
  isLoading: boolean
  isTyping: boolean
  isShowChat: boolean
  isError: boolean
  sessionId: string
  anonymousId: string
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [],
    isLoading: false,
    isTyping: false,
    isShowChat: false,
    isError: false,
    sessionId: '',
    anonymousId: localStorage.getItem('anonymousId') || '',
  }),
  actions: {
    async createSession(userId: string | null) {
      if (!userId) {
        if (!this.anonymousId) {
          console.log('create anonymousId')
          this.anonymousId = uuidv4()
          localStorage.setItem('anonymousId', this.anonymousId)
        }
        const response = await createSession({ userId: null }, this.anonymousId)
        this.sessionId = response.data.id
      } else {
        const response = await createSession({ userId })
        this.sessionId = response.data.id
      }
      localStorage.setItem('sessionId', this.sessionId)
    },

    async clearSession() {
      await endSession(this.sessionId)
      this.sessionId = ''
      localStorage.removeItem('sessionId')
      this.messages = []
    },

    toggleChat() {
      this.isShowChat = !this.isShowChat
    },

    async getSessionId() {
      this.sessionId = localStorage.getItem('sessionId') || ''
    },

    async getMessages(sessionId: string) {
      const response = await getChatHistory(sessionId)
      const messages = response.data.chatMessages.sort(
        (a: ChatMessageType, b: ChatMessageType) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )

      this.messages = messages
    },

    async addMessage(message: ChatMessageType) {
      this.messages.push(message)
    },

    async sendUserMessage(content: string) {
      try {
        this.isTyping = true
        const response = await sendMessage({ sessionId: this.sessionId, content })
        console.log(response)

        this.messages.push({
          id: response.data.chatMessages[0].id || '',
          content: response.data.chatMessages[0].content || '',
          tool: response.data.chatMessages[0].tool || '',
          role: 'Assistant',
          sessionId: this.sessionId,
          createdAt: response.data.chatMessages[0].createdAt,
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.isTyping = false
      }
    },
  },
})
