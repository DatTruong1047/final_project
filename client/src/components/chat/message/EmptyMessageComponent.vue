<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    <div class="mb-6">
      <ChatBubbleLeftEllipsisIcon class="w-16 h-16 text-gray-600 mx-auto" />
    </div>

    <h3 class="text-xl md:text-3xl font-semibold text-gray-600 mb-2">Hi, ready for a great deal?</h3>

    <p class="text-gray-500 text-sm md:text-lg mb-6 max-w-md">
      Start a conversation by sending your first message. I'm ready to help you!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'
</script>
