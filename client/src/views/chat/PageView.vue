<template>
  <div>
    <ChatComponent />
  </div>
</template>

<script setup lang="ts">
import ChatComponent from '@/components/chat/ChatComponent.vue'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const chatStore = useChatStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.id) {
    chatStore.createSession(authStore.id)
  } else {
    chatStore.createSession(null)
  }
})
</script>
