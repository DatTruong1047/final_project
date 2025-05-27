<template>
  <img :src="botImage" class="w-10 h-10 rounded-full" alt="bot" />
  <div>
    <div
      class="bg-gray-200 p-4 opacity-0 animate-fade-in text-gray-900 fade-in text-xl md:text-2xl rounded-xl max-w-2xl"
    >
    <div class="message-content" v-html="htmlContent"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'
import { marked } from 'marked'
import { computed } from 'vue'

const botImage = imageConfig.botImage

const props = defineProps<{
  message: string
}>()

const htmlContent = computed(() => {
  console.log(props.message)
  return marked.parse(props.message)
})
</script>

<style lang="scss">
@use '@/css/chat/_bot-message.scss' as *;
</style>
