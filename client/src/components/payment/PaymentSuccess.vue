<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex flex-col items-center text-center mb-6">
      <div class="mb-4 h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment successful!</h2>
      <p class="text-gray-600">
        Your order has been confirmed and is being processed. Thank you for shopping!
      </p>
    </div>

    <div class="border-t border-gray-200 pt-4 pb-2">
      <p class="text-gray-600 font-medium mb-1">Order details</p>
      <p class="text-sm text-gray-500 mb-1">Order ID: {{ paymentId }}</p>
      <p class="text-sm text-gray-500">Payment time: {{ paymentDate }}</p>
    </div>

    <div class="mt-6">
      <button
        @click="$emit('complete')"
        class="w-full px-4 py-2 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 transition-colors"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  paymentId: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: String,
    required: true,
  },
})

defineEmits(['complete'])
</script>
