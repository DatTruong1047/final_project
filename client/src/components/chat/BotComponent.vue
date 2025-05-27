<template>
  <div
    class="bottom-16 right-16 border-4 border-blue-300 rounded-full shadow-lg fixed z-50 hover:cursor-pointer hover:scale-110 hover:border-blue-600 transition-all duration-300"
  >
    <img
      :src="botImage"
      class="md:w-26 md:h-26 h-16 w-16  rounded-full hover:w-27 hover:h-27 transition-all duration-300"
      alt="bot"
      @click="toggleChat"
    />
  </div>
</template>

<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()
const botImage = imageConfig.botImage

const toggleChat = () => {
  chatStore.toggleChat()
}
</script>
