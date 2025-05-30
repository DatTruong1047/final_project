<template>
  <div>
    <!-- Name -->
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      {{ product.name }}
    </h1>
    <div class="flex items-center gap-4">
      <h1 class="text-xl md:text-xl font-bold text-gray-500 mb-4">
        Brand: <span class="text-red-500">{{ (product.brand?.name || '').toUpperCase() }}</span>
      </h1>

      <h1 class="text-xl md:text-xl font-bold text-gray-500 mb-4">
        SKU: <span class="text-red-500">{{ (product.code || '').toUpperCase() }}</span>
      </h1>
    </div>

    <div class="flex items-center mb-4 text-red-500 font-bold text-2xl sm:text-4xl">
      <span class="">
        {{ vndFormat(product.price || 0) }}
      </span>
    </div>
    <!-- Short Description -->
    <div class="flex items-start mb-4">
      <span class="text-gray-900 text-2xl">
        <p
          v-for="(line, index) in product.shortDescription?.split('\n').slice(0, 3)"
          :key="index"
          class="line-clamp-1"
        >
          - {{ line }}
        </p>
      </span>
    </div>

    <hr class="my-8 text-gray-400" />

    <!-- Add to cart -->
    <div class="flex items-center gap-4 mb-8">
      <!-- Quantity -->
      <div class="flex items-center sm:px-2 h-20 sm:py-4">
        <input
          type="number"
          v-model="quantity"
          class="w-20 h-16 text-center text-xl sm:text-2xl font-bold focus:ring-0 border border-gray-300 rounded-md"
          min="1"
          :disabled="!authStore.isAuthenticated"
          :class="{ 'opacity-50 cursor-not-allowed': !authStore.isAuthenticated }"
          :max="product.quantity || 0"
        />
      </div>

      <button
        class="flex bg-green-600 w-2/3 items-center justify-center text-lg text-center md:text-2xl font-bold text-white px-2 py-2 sm:px-4 sm:py-5 hover:bg-green-500 transition-colors duration-300 rounded-md cursor-pointer"
        @click="$emit('add-to-cart', quantity)"
        :disabled="!authStore.isAuthenticated"
        :class="{ 'opacity-50 cursor-not-allowed': !authStore.isAuthenticated }"
      >
        <ShoppingCartIcon class="w-6 h-6 mr-2" />
        Add to cart
      </button>
    </div>

    <!-- Delivery Info -->
    <div class="border border-gray-300 rounded-lg mb-8">
      <!-- Free Delivery -->
      <div class="flex items-center p-4 border-b border-gray-200">
        <div class="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        </div>

        <div>
          <h3 class="font-medium text-2xl">Free Delivery</h3>
          <p class="text-sm text-gray-500 md:text-xl">
            Enter your postal code for Delivery Availability
          </p>
        </div>
      </div>

      <!-- Return Delivery -->
      <div class="flex items-center p-4">
        <div class="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-2xl">Return Delivery</h3>
          <p class="text-sm text-gray-500 md:text-xl">Free 30 Days Delivery Returns. Details</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { vndFormat } from '@/helpers/processPrice'
import { useAuthStore } from '@/stores/authStore'
import { ShoppingCartIcon } from '@heroicons/vue/16/solid'

const authStore = useAuthStore()

interface Product {
  id?: string | number
  name?: string
  price?: number
  code?: string
  quantity?: number
  shortDescription?: string | null
  brand?: {
    name?: string
  }
}

defineProps({
  product: {
    type: Object as () => Product,
    required: true,
  },
})

defineEmits(['add-to-cart', 'buy-now'])

const quantity = ref(1)
watch(quantity, (newVal) => {
  if (newVal <= 0 || typeof newVal !== 'number') {
    quantity.value = 1
  }
})

const onIncrementQuantity = () => {
  quantity.value++
}

const onDecrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}
</script>
