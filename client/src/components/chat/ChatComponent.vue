<template>
  <div
    class="fixed right-0 bottom-0 sm:right-4 sm:bottom-4 rounded-lg sm:rounded-2xl w-full  h-screen  lg:w-[50rem] sm:w-[50rem]  lg:h-[70rem]  sm:h-[70rem]  flex flex-col bg-white shadow-md overflow-hidden z-50"
  >
    <!-- Header -->
    <ChatHeaderComponent />

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      <template v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="item">
        <!-- Bot message long -->
        <div class="flex items-start gap-2">
          <BotMessageComponent />
        </div>

        <!-- User message -->
        <div class="flex justify-end items-end gap-2">
          <HumanMessageComponent />
        </div>
      </template>
    </div>

    <!-- Footer input -->
    <div class="py-2 px-4 border-t border-gray-200 rounded-t-xl  h-[8rem] bg-white">
      <div class="flex items-center  px-4 py-4">
        <input
          type="text"
          placeholder="Type your message here..."
          class="flex-1 text-2xl md:text-3xl font-base outline-none"
        />
        <button class="p-2 rounded-full hover:bg-gray-200 px-4 py-4">
          <PaperAirplaneIcon class="w-10 h-10 text-blue-500 cursor-pointer" />
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imageConfig } from '@/configs/image.config'
import ChatHeaderComponent from './ChatHeaderComponent.vue';
import { PencilIcon, PaperAirplaneIcon, ArrowsPointingInIcon } from '@heroicons/vue/24/outline';
import BotMessageComponent from './BotMessageComponent.vue';
import HumanMessageComponent from './HumanMessageComponent.vue';
const botImage = imageConfig.botImage
const userImage = imageConfig.avatar
</script>

