<template>
  <div class="flex items-center px-4 py-4">
    <input
      type="text"
      placeholder="Type your message here..."
      :value="message"
      @input="onInput"
      class="flex-1 text-2xl md:text-3xl font-base outline-none"
      :disabled="chatStore.isTyping"
      @keydown.enter="onSendMessage"
    />
    <button
      class="p-2 rounded-full hover:bg-gray-200"
      :disabled="!message || chatStore.isTyping"
      @click="onSendMessage"
    >

      <PaperAirplaneIcon
        v-if="!chatStore.isTyping"
        class="w-10 h-10 text-blue-500 cursor-pointer"
        :class="{ 'opacity-50 pointer-events-none': !message }"
      />
      <BarsArrowUpIcon
        v-else
        class="w-10 h-10 text-blue-500 "
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PaperAirplaneIcon, BarsArrowUpIcon } from '@heroicons/vue/24/outline'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  (e: 'update:message', value: string): void
  (e: 'sendMessage'): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:message', target.value)
}

const onSendMessage = () => {
  if (props.message.trim()) {
    emit('sendMessage')
  }
}
</script>
