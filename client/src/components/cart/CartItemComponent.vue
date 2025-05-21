<script setup lang="ts">
import { vndFormat } from '@/helpers/processPrice'
import { imageConfig } from '@/configs'
import type { CartBaseType, CartDetailType } from '@/types/cartType'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
defineProps<{
  cart: CartBaseType
  onIncreaseQuantity: (id: string) => void
  onDecreaseQuantity: (id: string) => void
  onRemoveItem: (id: string) => void
  onSelectItem: (id: string, event: Event) => void
}>()
</script>

<template>
  <div class="border-b border-gray-200 last:border-b-0">
    <div class="grid grid-cols-1 sm:grid-cols-5 p-4 gap-4 items-center">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="absolute -top-3 -left-3 flex items-center justify-center">
            <button
              class="text-white hover:bg-red-500 rounded-full bg-red-600 p-1"
              @click="onRemoveItem(cart.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <img
            :src="cart.product.thumbnail?.media?.url || imageConfig.productDefault"
            :alt="cart.product.name"
            class="w-36 h-28 rounded-md"
          />
        </div>
        <div class="flex flex-col gap-1 ml-2">
          <h3 class="text-lg font-medium text-gray-900">{{ cart.product.name }}</h3>
          <p class="text-sm text-gray-500">SKU: {{ cart.product.code }}</p>
        </div>
      </div>

      <div class="md:text-left text-xl">
        <span class="md:hidden font-medium text-gray-700">Price: </span>
        <span class="text-red-500 font-bold">{{ vndFormat(cart.product.price) }}</span>
      </div>

      <div class="md:text-left text-2xl flex items-center gap-2">
        <button
          class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
          @click="onDecreaseQuantity(cart.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>

        <span class="w-12 text-center">{{ cart.quantity }}</span>

        <button
          class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="onIncreaseQuantity(cart.id)"
          :disabled="cart.quantity >= cart.product.quantity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div class="md:text-left text-xl">
        <span class="md:hidden font-medium text-gray-700">Total: </span>
        <span class="text-red-500 font-bold">{{
          vndFormat(cart.product.price * cart.quantity)
        }}</span>
      </div>

      <div class="md:text-left text-xl">
        <input
          :checked="cartStore.selectedCartIds.includes(cart.id)"
          id="link-checkbox"
          type="checkbox"
          value=""
          class="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          @change="onSelectItem(cart.id, $event)"
        />
      </div>
    </div>
  </div>
</template>
