import { sendMessage } from '@/api/chat'
import { defineStore } from 'pinia'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  isShowChat: boolean
  isError: boolean
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    messages: [{
      id: new Date().toISOString(),
      content: 'Xin chào, tôi là trợ lý của bạn. Tôi có thể giúp bạn tìm kiếm sản phẩm tốt nhất.',
      role: 'assistant',
    }],
    isLoading: false,
    isShowChat: false,
    isError: false,
  }),
  actions: {
    toggleChat() {
      this.isShowChat = !this.isShowChat
    },

    async addMessage(message: Message) {
      this.messages.push(message)
    },

    async sendUserMessage(message: Message) {
      try {
        this.isLoading = true
        const response = await sendMessage({ query: message.content })

        if (!response.data.response) {
          this.isError = true
          this.messages.push({
            id: new Date().toISOString(),
            content: 'Xin lỗi, hệ thống đang bảo trì, vui lòng thử lại sau.',
            role: 'assistant',
          })
        }
        this.messages.push({
          id: response.data.id || '',
          content: response.data.response,
          role: 'assistant',
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    clearMessages() {
      this.messages = []
    },
  },
})
