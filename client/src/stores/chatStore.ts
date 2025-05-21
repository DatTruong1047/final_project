import { defineStore } from 'pinia';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface ChatState {
  messages: Message[];
  history: Message[];
  isLoading: boolean;
  isShowChat: boolean;
}

export const useChatStore = defineStore('chat', {
  state: () : ChatState => ({
    messages: [],
    history: [],
    isLoading: false,
    isShowChat: false,
  }),
  actions: {
    toggleChat() {
      this.isShowChat = !this.isShowChat;
    },

    addMessage(message: Message) {
      this.messages.push(message);
    },
    addHistory(message: Message) {
      this.history.push(message);
    },
    clearHistory() {
      this.history = [];
    },
  },
});