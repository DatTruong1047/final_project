<template>
  <img :src="botImage" class="w-10 h-10 rounded-full" alt="bot" />
  <div>
    <div class="bg-blue-500 text-white text-xl md:text-2xl p-3 rounded-xl max-w-md">
      <p>Rapidly build stunning Web Apps with Frest 🚀</p>
    </div>
    <div class="text-2xl font-medium text-gray-400 mt-1">7:20</div>
  </div>
</template>
<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'

const botImage = imageConfig.botImage
</script>
