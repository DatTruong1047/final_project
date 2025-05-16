<template>
  <div class="bg-white h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
    <div class="hidden md:grid md:grid-cols-4 text-left p-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">Product</h2>
      <h2 class="text-xl font-bold text-gray-900 ml-2">Price</h2>
      <h2 class="text-xl font-bold text-gray-900 ml-2">Quantity</h2>
      <h2 class="text-xl font-bold text-gray-900 ml-2">Total</h2>
    </div>

    <CartItemComponent
      v-for="cart in data.carts || []"
      :key="cart.id"
      :cart="cart"
      :on-increase-quantity="onIncreaseQuantity"
      :on-decrease-quantity="onDecreaseQuantity"
      :on-remove-item="onRemoveItem"
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
}>()
</script>
