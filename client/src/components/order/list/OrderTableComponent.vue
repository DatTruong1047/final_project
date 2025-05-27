<template>
  <div class="h-[60%] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Contact Info
            </th>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Products
            </th>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Order Date
            </th>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th class="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <OrderTableRowComponent
            v-for="order in orders"
            :key="order.id"
            :order="order"
          />
        </tbody>
      </table>
    </div>

    <OrderEmptyStateComponent v-if="orders.length === 0" />
  </div>
</template>

<script setup lang="ts">
import OrderTableRowComponent from './OrderTableRowComponent.vue'
import OrderEmptyStateComponent from '@/components/order/state/OrderEmptyStateComponent.vue'
import type { OrderBaseType } from '@/types/orderType'
import type { PropType } from 'vue'

defineProps({
  orders: {
    type: Array as PropType<OrderBaseType[]>,
    required: true
  }
})
</script>
