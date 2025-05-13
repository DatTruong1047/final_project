<template>
  <ul class="my-2" v-if="categoryStore.categories.length > 0">
    <li
      v-for="(category, index) in categoryStore.categories"
      :key="category.id || index"
      class="px-4 py-3 hover:bg-gray-50 cursor-pointer text-2xl font-medium text-gray-700"
      :class="{ 'bg-gray-50': categoryStore.selectedCategory === category.id }"
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
