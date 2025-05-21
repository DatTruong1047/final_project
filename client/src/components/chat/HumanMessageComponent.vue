<template>
  <div>
    <div class="bg-gray-200 text-xl md:text-2xl p-2 rounded-xl max-w-md">
      More no. of lines text and showing complete list of features like time stamp + check icon READ
    </div>
    <div class="text-2xl font-medium text-gray-400 text-right mt-1 flex items-center gap-1 justify-end">
      7:20
      <PencilIcon class="w-6 h-6" />
    </div>
  </div>
  <img :src="userImage" class="w-14 h-14 rounded-full" alt="user" />
</template>
<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'

const userImage = imageConfig.avatar
</script>