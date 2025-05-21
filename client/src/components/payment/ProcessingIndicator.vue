<template>
  <div v-if="processing" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
    <div class="flex items-center">
      <svg
        class="animate-spin h-5 w-5 text-blue-500 mr-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div>
        <p class="font-medium text-blue-700">Processing payment</p>
        <p class="text-sm text-blue-600">
          Please do not close this page while we are processing your payment
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  processing: {
    type: Boolean,
    required: true,
  },
})
</script>
