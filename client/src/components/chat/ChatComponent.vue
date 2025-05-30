<template>
  <div
    class="fixed right-0 bottom-0 sm:right-4 sm:bottom-4 rounded-lg sm:rounded-2xl w-full h-screen lg:w-[50rem] sm:w-[50rem] lg:h-[70rem] sm:h-[70rem] flex flex-col bg-white shadow-md overflow-hidden z-50"
  >
    <!-- Header -->
    <ChatHeaderComponent />

    <!-- Messages -->
    <div class="flex-1 mt-2 overflow-y-auto p-4 space-y-4 bg-gray-50 chat-container">
      <template v-if="chatStore.messages.length > 0">
        <template v-if="chatStore.isLoading">
          <div class="flex justify-start items-start px-8 mb-1 ml-8">Loading...</div>
        </template>
        <template v-else>
          <template v-for="item in chatStore.messages" :key="item.id">
            <!-- User message -->
            <div class="flex justify-end items-end gap-2" v-if="item.role === 'User'">
              <HumanMessageComponent :message="item.content" />
            </div>
            <div class="flex items-start gap-2" v-else>
              <BotMessageComponent :message="item.content" :tool="item.tool" />
            </div>
          </template>
        </template>
      </template>
      <template v-else>
        <EmptyMessageComponent />
      </template>
    </div>
    <div v-if="chatStore.isTyping" class="flex justify-start items-start px-8 mb-1 ml-8">
      <TypingComponent />
    </div>

    <!-- Footer input -->
    <div class="py-2 px-4 border-t border-gray-200 rounded-t-xl h-[6rem] bg-white">
      <ChatInputComponent v-model:message="message" @sendMessage="onSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeaderComponent from './header/ChatHeaderComponent.vue'
import BotMessageComponent from './message/BotMessageComponent.vue'
import HumanMessageComponent from './message/HumanMessageComponent.vue'
import TypingComponent from '@/components/atoms/_utils/TypingComponent.vue'

import { useChatStore } from '@/stores/chatStore'
import { nextTick, onMounted, ref, watch } from 'vue'
import ChatInputComponent from './input/ChatInputComponent.vue'
import EmptyMessageComponent from './message/EmptyMessageComponent.vue'

const chatStore = useChatStore()

const message = ref('')

console.log(chatStore.sessionId)

watch(
  () => chatStore.messages,
  () => {
    nextTick(() => {
      onScrollBottom()
    })
  },
  { deep: true },
)

const onSendMessage = () => {
  if (message.value.trim()) {
    chatStore.addMessage({
      id: new Date().toISOString(),
      sessionId: chatStore.sessionId,
      content: message.value,
      role: 'User',
      createdAt: new Date().toISOString(),
      tool: 'user_message',
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

watch(
  () => chatStore.sessionId,
  () => {
    chatStore.getMessages(chatStore.sessionId)
    onScrollBottom()
  },
)

onMounted(() => {
  chatStore.getSessionId()
  chatStore.getMessages(chatStore.sessionId)
  onScrollBottom()
})
</script>
