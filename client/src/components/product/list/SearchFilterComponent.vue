<template>
  <div class="p-6 mx-auto bg-white shadow-md rounded-lg border border-gray-100">
    <div class="grid grid-cols-1 md:grid-cols-6 gap-6 items-center">
      <div class="relative col-span-12 md:col-span-3">
        <label class="block text-xl font-medium text-gray-500 mb-4 uppercase tracking-wider"
          >Search</label
        >
        <div
          class="absolute  -inset-y-2 mb-1 left-3 flex items-center text-gray-400 pointer-events-none"
          style="top: 24px"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m0 0A7 7 0 1010.5 17.5a7 7 0 006.15-3.85z"
            />
          </svg>
        </div>
        <input
          type="text"
          class="w-full text-2xl pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-gray-700 bg-gray-50 hover:bg-white"
          v-model="localSearchText"
          placeholder="Search for products..."
        />
      </div>

      <div class="relative col-span-12 md:col-span-1">
        <label class="block text-xl font-medium text-gray-500 mb-4 uppercase tracking-wider"
          >Sort by</label
        >
        <div class="relative">
          <select
            v-model="localSortBy"
            class="w-full text-xl appearance-none bg-gray-50 hover:bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option v-for="sortBy in ProductSortBy" :key="sortBy" :value="sortBy">
              {{ sortBy === 'createdAt' ? 'Date' : 'Price' }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="relative col-span-12 md:col-span-1">
        <label class="block text-xl mb-4 font-medium text-gray-500 uppercase tracking-wider"
          >Order</label
        >
        <div class="relative">
          <select
            v-model="localSortOrder"
            class="w-full text-xl appearance-none bg-gray-50 hover:bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option v-for="sortOrder in ProductSort" :key="sortOrder" :value="sortOrder">
              {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ProductSort, ProductSortBy } from '@/types/productType'

const props = defineProps<{
  searchText: string
  sortBy: string
  sortOrder: string
}>()

const localSearchText = ref(props.searchText)
const localSortBy = ref(props.sortBy)
const localSortOrder = ref(props.sortOrder)

const emit = defineEmits<{
  (e: 'update:searchText', value: string): void
  (e: 'update:sortBy', value: ProductSortBy): void
  (e: 'update:sortOrder', value: ProductSort): void
}>()

watch(localSearchText, (newValue) => {
  emit('update:searchText', newValue)
})

watch(localSortBy, (newValue) => {
  if (Object.values(ProductSortBy).includes(newValue as ProductSortBy)) {
    emit('update:sortBy', newValue as ProductSortBy)
  } else {
    emit('update:sortBy', ProductSortBy.CREATED_AT)
  }
})

watch(localSortOrder, (newValue) => {
  if (Object.values(ProductSort).includes(newValue as ProductSort)) {
    emit('update:sortOrder', newValue as ProductSort)
  } else {
    emit('update:sortOrder', ProductSort.DESC)
  }
})

watch(
  () => [props.searchText, props.sortBy, props.sortOrder],
  ([newSearchText, newSortBy, newSortOrder]) => {
    localSearchText.value = newSearchText
    localSortBy.value = newSortBy
    localSortOrder.value = newSortOrder
  },
)
</script>
