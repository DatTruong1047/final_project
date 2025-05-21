<template>
  <div class="mx-auto">
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
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useI18n } from 'vue-i18n'

const categoryStore = useCategoryStore()
const { showToast } = useToast()
const { t } = useI18n()

onMounted(async () => {
  try {
    await categoryStore.getCategories()
  } catch {
    showToast(ToastEnum.Error, t('message.error.loadCategoriesFail'))
  }
})
</script>
