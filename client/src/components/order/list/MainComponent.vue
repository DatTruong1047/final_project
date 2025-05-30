<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto h-screen">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p class="text-lg text-gray-600">Track and manage all your orders</p>
      </div>

      <!-- Filters -->
      <OrderFilters
        :order-statuses="orderStatuses"
        :selected-status="selectedStatus"
        :loading="isLoading"
        :total-orders="totalOrders"
        @status-change="changeStatus"
      />

      <!-- Loading State -->
      <LoadingComponent v-if="isLoading" />

      <!-- Orders List -->
      <OrderTableComponent v-else :orders="orders" />

      <!-- Pagination -->
      <PaginationComponent
        v-if="orders.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-orders="totalOrders"
        :limit="limit"
        :loading="isLoading"
        @page-change="changePage"
      />

      <!-- Error State -->
      <OrderErrorStateComponent
        v-if="orderStore.error"
        :error="orderStore.error"
        @retry="fetchOrders"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { storeToRefs } from 'pinia'
import OrderFilters from '@/components/order/list/OrderFilterComponent.vue'
import OrderTableComponent from '@/components/order/list/OrderTableComponent.vue'
import PaginationComponent from '@/components/_utils/PaginationComponent.vue'
import OrderErrorStateComponent from '@/components/order/state/OrderErrorStateComponent.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import type { OrderStatus } from '@/types/orderType'

const orderStore = useOrderStore()
const { orders, isLoading, totalOrders, limit, totalPages, currentPage } = storeToRefs(orderStore)


const selectedStatus = ref('CREATED')

const orderStatuses = [
  { value: '', label: 'All' },
  { value: 'CREATED', label: 'Created' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
]

const changeStatus = (status: OrderStatus | '') => {
  selectedStatus.value = status
  currentPage.value = 1
  if (status === '') {
    orderStore.getOrders({ page: currentPage.value, limit: limit.value })
  } else {
    orderStore.getOrders({
      page: currentPage.value,
      limit: limit.value,
      status: selectedStatus.value,
    })
  }
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    orderStore.getOrders({ page, limit: limit.value, status: selectedStatus.value })
  }
}

const fetchOrders = () => {
  orderStore.getOrders({
    page: currentPage.value,
    limit: limit.value,
    status: selectedStatus.value,
  })
}

onMounted(() => {
  fetchOrders()
})
</script>
