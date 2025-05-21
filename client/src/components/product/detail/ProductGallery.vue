<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex md:flex-col flex-row gap-4 order-2 md:order-1">
      <div
        v-for="(image, index) in productMedias.slice(0, 5)"
        :key="index"
        class="w-16 h-16 sm:w-28 sm:h-28 border-gray-200 rouded"
        :class="{ 'border-2 border-red-300 rounded-lg scale-120': selectedImageIndex === index }"
        @click="selectedImageIndex = index"
      >
        <img
          :src="image.media.url || imageConfig.productDefault"
          :alt="`Product Image ${image.id}`"
          class="w-full h-full object-contain p-2 "
        />
      </div>
    </div>

    <!-- Main image -->
    <div class="flex-1 bg-white md:max-h-[48rem] rounded-lg order-1 md:order-2">
      <div class="relative w-full h-full">
        <img
          :src="productMedias[selectedImageIndex].media.url || imageConfig.productDefault"
          :alt="`Product Image ${productMedias[selectedImageIndex].id}`"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { imageConfig } from '@/configs'

interface ProductMedia {
  id: number | string
  media: {
    url: string
  }
}

defineProps({
  productMedias: {
    type: Array as () => ProductMedia[],
    required: true,
  },
})

const selectedImageIndex = ref(0)
</script>
