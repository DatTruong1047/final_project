<template>
  <div>
    <div class="flex items-center mb-6">
      <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
      <h2 class="text-3xl font-bold text-red-500">Related Items</h2>
    </div>

    <div class="grid grid-cols-2 bg-gray-50 lg:grid-cols-3 gap-2 mb-16">
      <RouterLink
        class="bg-red-50 rounded overflow-hidden group hover:shadow-md transition-shadow duration-500"
        v-for="product in products"
        :key="product.id"
        :to="{ name: productRoute, params: { id: product.id } }"
      >
        <div class="relative bg-white h-64">
          <img
            :src="product.thumbnail.media.url"
            :alt="`Product Image ${product.name}`"
            class="w-full h-full object-contain p-4"
          />
        </div>
        <div class="p-4 h-40">
          <h3 class="text-lg font-medium">
            <span class="text-gray-500">
              {{ product.brand?.name }}
            </span>
          </h3>
          <h2 class="text-lg sm:text-2xl h-16 font-medium">{{ product.name }}</h2>

          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-red-500 font-medium mr-2 text-2xl">
                {{ vndFormat(product.price) }}
              </span>
            </div>

            <div class="flex">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
              <span class="text-xs text-gray-500 ml-1"> 100 </span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { vndFormat } from '@/helpers/processPrice'

interface Product {
  id: string | number
  name: string
  price: number
  brand?: {
    name: string
  }
  thumbnail: {
    media: {
      url: string
    }
  }
}

defineProps({
  products: {
    type: Array as () => Product[],
    required: true,
  },
  productRoute: {
    type: String,
    required: true,
  },
})
</script>
