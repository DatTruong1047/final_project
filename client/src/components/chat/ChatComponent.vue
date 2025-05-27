<template>
  <div
    class="fixed right-0 bottom-0 sm:right-4 sm:bottom-4 rounded-lg sm:rounded-2xl w-full h-screen lg:w-[50rem] sm:w-[50rem] lg:h-[70rem] sm:h-[70rem] flex flex-col bg-white shadow-md overflow-hidden z-50"
  >
    <!-- Header -->
    <ChatHeaderComponent />

    <!-- Messages -->
    <div class="flex-1 mt-2 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-container">
      <template v-for="item in chatStore.messages" :key="item.id">
        <div class="flex items-start gap-2" v-if="item.role === 'Assistant'">
          <BotMessageComponent :message="item.content" />
        </div>

        <!-- User message -->
        <div class="flex justify-end items-end gap-2" v-else>
          <HumanMessageComponent :message="item.content" />
        </div>
      </template>
    </div>
    <div v-if="chatStore.isLoading" class="flex justify-start items-start px-8 mb-1 ml-8 ">
      <TypingComponent />
    </div>

    <!-- Footer input -->
    <div class="py-2 px-4 border-t border-gray-200 rounded-t-xl h-[6rem] bg-white">
      <div class="flex items-center px-4 py-4">
        <input
          type="text"
          placeholder="Type your message here..."
          v-model="message"
          class="flex-1 text-2xl md:text-3xl font-base outline-none"
          @keydown.enter="onSendMessage"
        />
        <button class="p-2 rounded-full hover:bg-gray-200">
          <PaperAirplaneIcon
            class="w-10 h-10 text-blue-500 cursor-pointer"
            :disabled="message.length === 0"
            @click="onSendMessage"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeaderComponent from './ChatHeaderComponent.vue'
import { PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import BotMessageComponent from './BotMessageComponent.vue'
import HumanMessageComponent from './HumanMessageComponent.vue'
import TypingComponent from '@/components/atoms/_utils/TypingComponent.vue'

import { useChatStore } from '@/stores/chatStore'
import { nextTick, onMounted, ref, watch } from 'vue'

const chatStore = useChatStore()

const message = ref('')

watch(() => chatStore.messages, () => {
  nextTick(() => {
    onScrollBottom()
  })
}, { deep: true })

const onSendMessage = () => {
  if (message.value.length > 0) {
    chatStore.addMessage({
      id: new Date().toISOString(),
      sessionId: chatStore.sessionId,
      content: message.value,
      role: 'User',
      createdAt: new Date().toISOString(),
    })

    chatStore.sendUserMessage(message.value)

    message.value = ''
    onScrollBottom()
  }
}

const onScrollBottom = () => {
  const chatContainer = document.querySelector('.chat-container')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

watch(() => chatStore.sessionId, () => {
  chatStore.getMessages(chatStore.sessionId)
})

onMounted(() => {
  onScrollBottom()
})
</script>
