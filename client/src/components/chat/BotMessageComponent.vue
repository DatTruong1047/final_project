<template>
  <img :src="botImage" class="w-10 h-10  rounded-full" alt="bot" />
  <div>
    <div class="bg-blue-500 p-4 opacity-0 animate-fade-in  text-white fade-in text-xl md:text-2xl rounded-xl max-w-md">
      <p>{{ message }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'

const botImage = imageConfig.botImage

defineProps<{
  message: string
}>()
</script>

<style lang="scss">
@use '@/css/chat/_bot-message.scss' as *;
</style>
