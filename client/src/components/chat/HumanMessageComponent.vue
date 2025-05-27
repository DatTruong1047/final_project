<template>
  <div>
    <div class="bg-blue-500 text-white   justify-end text-xl w-auto px-6 py-4  md:text-2xl p-2 rounded-xl max-w-md flex ">
      {{ message }}
    </div>
  </div>
  <img :src="userImage" class="w-14 h-14 rounded-full" alt="user" />
</template>
<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'
const userImage = imageConfig.avatar

defineProps<{
  message: string
}>()
</script>