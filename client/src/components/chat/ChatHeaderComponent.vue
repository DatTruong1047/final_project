<template>
    <div class="bg-[#1572d6] h-fit p-4 flex items-center justify-between text-white">
      <div class="flex items-center gap-2 px-2 w-full h-20">
        <div class="rounded-full p-1 w-16 sm:w-20 flex items-center justify-center">
          <img :src="botImage" class="rounded-full" alt="bot" />
        </div>
        <div class="pt-1">
          <div class="text-2xl sm:text-3xl font-medium">AI Assistant</div>
        </div>
      </div>
      <button class="flex px-4 py-4 rounded-full hover:bg-white/20">
        <ArrowPathIcon class="h-8 w-8 text-white" />
      </button>
      <button class="flex px-4 py-4 rounded-full hover:bg-white/20">
        <ArrowsPointingInIcon class="h-8 w-8 text-white" />
      </button>
    </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ArrowsPointingInIcon } from '@heroicons/vue/16/solid'
import { imageConfig } from '@/configs/image.config'

const botImage = imageConfig.botImage
</script>