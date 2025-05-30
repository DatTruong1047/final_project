<template>
  <tr class="hover:bg-gray-50 transition-colors">
    <td class="px-8 py-6 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">#{{ order.id.substring(0, 8) }}...</div>
    </td>
    <td class="px-8 py-6 whitespace-nowrap text-xl">
      <div class="flex items-center">
        <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <PhoneIcon class="h-6 w-6 text-white" />
        </div>
        <div class="ml-4">
          <div class="text-sm md:text-lg font-medium text-gray-900">{{ order.phoneNumber }}</div>
        </div>
      </div>
    </td>
    <td class="px-8 py-6">
      <div class="max-w-xs">
        <div v-for="detail in order.orderDetails" :key="detail.id" class="mb-3 last:mb-0">
          <div class="text-sm md:text-lg font-medium text-gray-900">
            {{ detail.productName }}
          </div>
          <div class="text-sm md:text-lg text-red-500">
            Quantity: {{ detail.quantity }} × {{ vndFormat(detail.unitPrice) }}
          </div>
        </div>
      </div>
    </td>
    <td class="px-8 py-6 whitespace-nowrap">
      <div class="text-sm md:text-lg text-gray-900">{{ formatDate(order.orderDate) }}</div>
      <div class="text-sm md:text-lg text-gray-500">{{ formatTime(order.orderDate) }}</div>
    </td>
    <td class="px-8 py-6 whitespace-nowrap">
      <div class="text-sm md:text-lg font-medium text-red-500">
        {{ vndFormat(Number(order.totalAmount)) }}
      </div>
    </td>
    <td class="px-8 py-6 whitespace-nowrap">
      <span
        :class="[
          'inline-flex px-3 py-1.5 text-sm font-bold rounded-full uppercase',
          getStatusColor(order.orderStatus as OrderStatus),
        ]"
      >
        {{ getStatusLabel(order.orderStatus as OrderStatus) }}
      </span>

      <button
        v-if="order.orderStatus === 'CREATED' && order.paymentIntent?.clientSecret"
        class="ml-2 inline-flex px-3 py-1.5 text-sm font-bold rounded-full uppercase bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-300 text-white"
        @click="onPayment"
      >
        Pay now
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { formatTime, formatDate } from '@/helpers/formatDate'
import { vndFormat } from '@/helpers/processPrice'
import { PhoneIcon } from '@heroicons/vue/24/outline'
import type { OrderBaseType, OrderStatus } from '@/types/orderType'
import type { PropType } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useRouter } from 'vue-router'
import { paymentRoute } from '@/configs'

const orderStore = useOrderStore()
const router = useRouter()

const props = defineProps({
  order: {
    type: Object as PropType<OrderBaseType>,
    required: true,
  },
})

console.log(props.order)

const getStatusColor = (status: OrderStatus) => {
  const colors = {
    CREATED: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: OrderStatus) => {
  const labels = {
    CREATED: 'Created',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  }
  return labels[status] || status
}

const onPayment = () => {
  console.log('Payment')
  orderStore.order = props.order
  router.push({
    name: paymentRoute.payment,
    params: { clientSecret: props.order.paymentIntent?.clientSecret },
  })
}
</script>
