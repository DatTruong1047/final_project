<template>
  <div class="mt-8 flex items-center justify-between">
    <div class="text-base text-gray-700">
      Showing {{ (currentPage - 1) * limit + 1 }} -
      {{ Math.min(currentPage * limit, totalOrders) }}
      of {{ totalOrders }} orders
    </div>
    <div class="flex space-x-3">
      <button
        @click="$emit('pageChange', currentPage - 1)"
        :disabled="currentPage === 1 || loading"
        :class="[
          'px-4 py-2 text-base font-medium rounded-md',
          currentPage === 1 || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
        ]"
      >
        Previous
      </button>

      <span class="px-4 py-2 text-base font-medium text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        @click="$emit('pageChange', currentPage + 1)"
        :disabled="currentPage >= totalPages || loading"
        :class="[
          'px-4 py-2 text-base font-medium rounded-md',
          currentPage >= totalPages || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
        ]"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalOrders: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['pageChange'])
</script>
