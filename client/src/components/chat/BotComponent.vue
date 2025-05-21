<template>
  <div class="bottom-0 right-0 fixed z-50">
    <img :src="botImage" class="w-10 h-10 rounded-full" alt="bot" />
  </div>
</template>

<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'

const botImage = imageConfig.botImage
</script>
