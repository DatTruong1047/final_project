<template>
  <div class="mx-auto bg-gray-100">
    <div class="flex flex-col md:flex-row gap-2 h-full">
      <div
        class="hidden md:block w-full md:w-1/4 bg-white shadow-md rounded-lg overflow-hidden h-[40rem]"
      >
        <CategoryList class="h-full" />
      </div>
      <div class="w-full md:w-3/4 md:h-[40rem] sm:h-[30rem] h-[14rem] shadow-md">
        <BannerComponent class="h-full" />
      </div>
    </div>
    <div class="w-full">
      <CategorySlider class="mb-4" />
      <ProductGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CategoryList from '@/components/product/list/CategoryList.vue'
import BannerComponent from '@/components/product/list/BannerComponent.vue'
import CategorySlider from '@/components/product/list/CategorySlider.vue'
import ProductGrid from '@/components/product/list/ProductGrid.vue'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()

onMounted(async () => {
  try {
    await categoryStore.getCategories()
    console.log('Categories loaded:', categoryStore.categories)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})
</script>
