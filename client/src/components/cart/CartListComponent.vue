<template>
  <div class="bg-white h-full m-1 md:min-h-[500px] rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
    <!-- Desktop Header -->
    <div class="hidden md:grid md:grid-cols-12 gap-6 p-4 border-b border-gray-200 bg-gray-50">
      <div class="col-span-5">
        <h2 class="text-xl font-semibold text-gray-700">Product</h2>
      </div>
      <div class="col-span-2">
        <h2 class="text-xl font-semibold text-gray-700">Price</h2>
      </div>
      <div class="col-span-3">
        <h2 class="text-xl font-semibold text-gray-700">Quantity</h2>
      </div>
      <div class="col-span-1">
        <h2 class="text-xl font-semibold text-gray-700">Total</h2>
      </div>
      <div class="col-span-1">
        <h2 class="text-xl font-semibold text-gray-700 text-right">Select</h2>
      </div>
    </div>

    <CartItemComponent
      v-for="cart in data.carts || []"
      :key="cart.id"
      :cart="cart"
      :on-increase-quantity="onIncreaseQuantity"
      :on-decrease-quantity="onDecreaseQuantity"
      :on-remove-item="onRemoveItem"
      :on-select-item="onSelectItem"
    />
  </div>
</template>

<script setup lang="ts">
import type { CartListType } from '@/types/cartType'
import CartItemComponent from './CartItemComponent.vue'

defineProps<{
  data: CartListType
  onIncreaseQuantity: (id: string) => void
  onDecreaseQuantity: (id: string) => void
  onRemoveItem: (id: string) => void
  onSelectItem: (id: string, event: Event) => void
}>()
</script>
