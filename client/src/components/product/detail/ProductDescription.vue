<template>
  <div>
    <div class="flex items-center mb-6">
      <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
      <h2 class="text-3xl font-bold text-red-500">Information</h2>
    </div>
    <div
      class="p-5 text-base sm:text-xl font-sans leading-relaxed text-gray-700 bg-white dark:text-white dark:bg-gray-800 text-justify"
    >
      <p v-if="!showFullDescription">
        {{ truncatedDescription }}<span v-if="isTruncatable">...</span>
        <button
          v-if="isTruncatable"
          @click="showFullDescription = true"
          class="text-red-500 font-medium hover:underline ml-2"
        >
          View more
        </button>
      </p>
      <p v-else>
        {{ description }}
        <button
          @click="showFullDescription = false"
          class="text-red-500 font-medium hover:underline ml-2"
        >
          View less
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  description: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: 300,
  },
})

const showFullDescription = ref(false)

const truncatedDescription = computed(() => {
  return props.description.length > props.maxLength
    ? props.description.slice(0, props.maxLength)
    : props.description
})

const isTruncatable = computed(() => {
  return props.description.length > props.maxLength
})
</script>
