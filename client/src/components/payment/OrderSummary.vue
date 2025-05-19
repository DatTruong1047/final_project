<template>
  <div class="bg-white rounded-lg shadow-sm border border-slate-200">
    <div class="p-6 pb-3">
      <h2 class="text-xl font-bold sm:text-3xl">Checkout</h2>
      <p class="text-slate-500 text-md md:text-xl mt-1">
        Order ID: <span class="font-medium">{{ order.id }}</span>
      </p>
    </div>

    <div class="p-6 pt-3 space-y-4">
      <div class="grid grid-cols-2 gap-4 text-xl">
        <div>
          <p class="text-slate-500">Order Date</p>
          <p class="font-medium">{{ formatDate(order.orderDate) }}</p>
        </div>
        <div>
          <p class="text-slate-500">Order Status</p>
          <span
            class="inline-flex px-1 py-1.5 rounded-full text-lg font-bold bg-amber-50 text-amber-700"
          >
            {{ order.orderStatus }}
          </span>
        </div>
        <div>
          <p class="text-slate-500">Phone Number</p>
          <p class="font-medium">{{ order.phoneNumber }}</p>
        </div>
        <div>
          <p class="text-slate-500">Note</p>
          <p class="font-medium">{{ order.note || 'Không có' }}</p>
        </div>
      </div>

      <div class="border-t border-slate-200 my-4"></div>

      <div class="space-y-4 text-xl">
        <h3 class="font-semibold flex items-center text-2xl gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-package"
          >
            <path d="m7.5 4.27 9 5.15" />
            <path
              d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          Product Details
        </h3>

        <div v-for="item in order.orderDetails" :key="item.id" class="bg-slate-50 p-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <h4 class="font-medium">{{ item.productName }}</h4>
              <p class="text-lg text-slate-500">Unit Price: {{ vndFormat(item.unitPrice) }}</p>
            </div>
            <div class="text-right">
              <span
                class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 text-sm font-medium"
              >
                {{ item.quantity }}
              </span>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-dashed border-slate-200 flex justify-between">
            <span class="text-xl text-slate-500">Total:</span>
            <span class="font-semibold text-xl">{{ vndFormat(item.subTotal) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 font-bold text-xl">
          <span>Total Payment:</span>
          <span class="text-red-600 text-3xl uppercase"> {{ vndFormat(order.totalAmount) }} </span>
        </div>
      </div>
    </div>
  </div>

  <div class="flex text-xl items-center gap-2 text-slate-500 justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-emerald-500"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    Secure and safe payment with Stripe
  </div>
</template>

<script setup lang="ts">
import { vndFormat, formatDate } from '@/helpers/processPrice'

defineProps({
  order: {
    type: Object,
    required: true,
  },
})
</script>
