<template>
  <div class="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
    <div class="flex">
      <svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div class="ml-4">
        <h3 class="text-base font-medium text-red-800">An error occurred</h3>
        <button
          @click="$emit('retry')"
          class="mt-3 text-base text-red-600 hover:text-red-500 underline"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  error: {
    type: Boolean as PropType<boolean>,
    required: true
  }
})

defineEmits(['retry'])
</script>
