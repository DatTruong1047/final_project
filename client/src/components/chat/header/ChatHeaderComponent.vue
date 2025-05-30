<template>
  <div class="bg-[#15508f] h-fit p-4 flex items-center justify-between text-white">
    <div class="flex items-center gap-2 px-2 w-full h-20">
      <div class="rounded-full p-1 w-16 sm:w-20 flex items-center justify-center">
        <img :src="botImage" class="rounded-full" alt="bot" />
      </div>
      <div class="pt-1">
        <div class="text-2xl sm:text-3xl font-medium">AI Assistant</div>
      </div>
    </div>
    <button class="flex px-4 py-4 rounded-full hover:bg-white/20">
      <ArrowPathIcon @click="onRefreshChat" class="h-8 w-8 text-white" />
    </button>
    <button class="flex px-4 py-4 rounded-full hover:bg-white/20">
      <ArrowsPointingInIcon class="h-8 w-8 text-white" @click="toggleChat" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ArrowsPointingInIcon } from '@heroicons/vue/16/solid'
import { imageConfig } from '@/configs/image.config'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'

const botImage = imageConfig.botImage
const chatStore = useChatStore()
const authStore = useAuthStore()

const toggleChat = () => {
  chatStore.toggleChat()
}

const onRefreshChat = async () => {
  try {
    chatStore.isLoading = true
    await chatStore.clearSession()

    if (authStore.id) {
      await chatStore.createSession(authStore.id)
    } else {
      await chatStore.createSession(null)
    }

    if (chatStore.sessionId) {
      await chatStore.getMessages(chatStore.sessionId)
    }
  } catch (error) {
    console.error('Error refreshing chat:', error)
  } finally {
    chatStore.isLoading = false
  }
}
</script>
