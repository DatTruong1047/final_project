<template>
  <h1 class="text-2xl px-2 py-3 my-2 border-b font-bold text-red-500">CATEGORIES</h1>
  <ul class="my-2" v-if="categoryStore.categories.length > 0">
    <li
      v-for="(category, index) in categoryStore.categories.slice(0, 12)"
      :key="category.id || index"
      class="px-4 py-2 border-gray-50 border-b hover:bg-red-50 cursor-pointer text-xl font-medium text-gray-700"
      :class="{ 'bg-red-200': categoryStore.selectedCategory === category.id }"
      @click="categoryStore.setSelectedCategory(category.id)"
    >
      {{ category.name }}
    </li>
  </ul>
  <div v-else>
    <p>{{ t('message.error.noCategoriesFound') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'

const categoryStore = useCategoryStore()
const { t } = useI18n()
</script>
