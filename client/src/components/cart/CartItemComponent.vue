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
  <div class="shadow-sm shadow-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div class="p-3 sm:p-4">
      <!-- Mobile Layout -->
      <div class="md:hidden">
        <!-- Product Info Row -->
        <div class="flex gap-3 mb-3">
          <div class="relative flex-shrink-0">
            <div class="absolute -top-2 -left-2 z-10">
              <button
                class="text-white hover:bg-red-500 rounded-full bg-red-600 p-1"
                @click="onRemoveItem(cart.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
              class="w-20 h-20 rounded-md object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 truncate">{{ cart.product.name }}</h3>
            <p class="text-xs text-gray-500 mt-1">SKU: {{ cart.product.code }}</p>
            <div class="text-red-500 font-bold text-sm mt-1">
              <span>Price:</span> {{ vndFormat(cart.product.price) }}
            </div>
          </div>
        </div>

        <!-- Quantity and Total Row -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              class="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
              @click="onDecreaseQuantity(cart.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="w-8 text-center text-xl">{{ cart.quantity }}</span>
            <button
              class="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onIncreaseQuantity(cart.id)"
              :disabled="cart.quantity >= cart.product.quantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
          <div class="flex items-center gap-3">
            <div class="text-red-500 font-bold text-base">
              <span>Total:</span> {{ vndFormat(cart.product.price * cart.quantity) }}
            </div>
            <input
              :checked="cartStore.selectedCartIds.includes(cart.id)"
              type="checkbox"
              class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
              @change="onSelectItem(cart.id, $event)"
            />
          </div>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden  md:grid md:grid-cols-12 gap-6 items-center">
        <!-- Product Info -->
        <div class="col-span-5">
          <div class="flex items-center gap-4">
            <div class="relative flex-shrink-0">
              <div class="absolute -top-2 -left-2 z-10">
                <button
                  class="text-white hover:bg-red-500 rounded-full bg-red-600 p-1.5 transition-colors"
                  @click="onRemoveItem(cart.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
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
                class="w-28 h-28 rounded-lg object-cover shadow-sm"
              />
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-gray-900 truncate">{{ cart.product.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">SKU: {{ cart.product.code }}</p>
            </div>
          </div>
        </div>

        <!-- Price -->
        <div class="col-span-2">
          <div class="flex flex-col">
            <span class="text-lg font-bold text-red-500 mt-1">{{ vndFormat(cart.product.price) }}</span>
          </div>
        </div>

        <!-- Quantity -->
        <div class="col-span-3">
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <button
                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
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

              <span class="w-12 text-center text-xl font-medium">{{ cart.quantity }}</span>

              <button
                class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>

        <!-- Total -->
        <div class="col-span-1">
          <div class="flex flex-col">
            <span class="text-lg font-bold text-red-500 mt-1">{{
              vndFormat(cart.product.price * cart.quantity)
            }}</span>
          </div>
        </div>

        <!-- Checkbox -->
        <div class="col-span-1 flex justify-end">
          <input
            :checked="cartStore.selectedCartIds.includes(cart.id)"
            type="checkbox"
            class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
            @change="onSelectItem(cart.id, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
