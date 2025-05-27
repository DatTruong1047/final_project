<template>
  <div class="lg:col-span-1 text-2xl">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <h2 class="font-bold text-gray-800 mb-4 uppercase">Cart Total</h2>

      <div class="border-b border-gray-200 py-3 flex justify-between">
        <span class="font-medium text-gray-700 uppercase">Subtotal:</span>
        <span class="font-medium text-red-500">{{ vndFormat(cartStore.getCartTotalPrice) }}</span>
      </div>

      <div class="border-b border-gray-200 py-3 flex justify-between">
        <span class="font-medium text-gray-700 uppercase">Shipping:</span>
        <span class="font-medium text-red-500">Free</span>
      </div>

      <div class="border-b border-gray-200 py-3 flex justify-between mb-8">
        <span class="font-medium text-gray-700 uppercase">Total:</span>
        <span class="font-bold text-red-500 text-2xl">{{
          vndFormat(cartStore.getCartTotalPrice)
        }}</span>
      </div>

      <button
        :disabled="cartStore.getCartTotalPrice <= 0 || !cartStore.getSelectedCartItems.length"
        @click="onProceedToCheckout"
        class="w-full text-xl text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-bold rounded-lg px-5 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Proceed to checkout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vndFormat } from '@/helpers/processPrice'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { cartRoute, orderRoute } from '@/configs/routeConfig'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'

const cartStore = useCartStore()

const router = useRouter()
const { showToast } = useToast()

const onProceedToCheckout = async () => {
  if (!cartStore.getSelectedCartItems.length) {
    showToast(ToastEnum.Error, 'Please select at least one item in your cart')
    return
  }

  console.log('cartStore.getSelectedCartItems', cartStore.getSelectedCartItems)

  router.push({ name: orderRoute.checkoutInfo })
}
</script>
