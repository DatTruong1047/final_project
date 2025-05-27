<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="status in orderStatuses"
          :key="status.value"
          @click="$emit('statusChange', status.value)"
          :disabled="loading"
          :class="[
            'px-6 py-3 rounded-lg text-sm uppercase font-medium transition-colors',
            selectedStatus === status.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            loading ? 'opacity-50 cursor-not-allowed' : '',
          ]"
        >
          {{ status.label }}
          <span
            class="ml-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            v-if="selectedStatus === status.value"
          >
            {{ totalOrders }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  orderStatuses: {
    type: Array,
    required: true
  },
  selectedStatus: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  totalOrders: {
    type: Number,
    default: 0
  }
})

defineEmits(['statusChange'])
</script>
