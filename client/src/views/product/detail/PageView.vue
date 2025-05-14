<template>
  <div>
    <template v-if="productStore.loading.productDetail">
      <LoadingComponent />
    </template>
    <template v-else>
      <div v-if="!productStore.productDetail" class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-700">Product not found</h2>
        <p class="mt-2 text-gray-500">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          @click="router.push('/')"
          class="mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Return to Shop
        </button>
      </div>
      <template v-else>
        <ProductDetail />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import ProductDetail from '@/components/product/detail/ProductDetail.vue'
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import router from '@/router'
import { ProductSort, ProductSortBy } from '@/types/productType'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const productStore = useProductStore()
const { showToast } = useToast()

const { t } = useI18n()

const hasInitialized = ref(false)

const productId = computed(() => route.params.id as string)

const fetchProductDetail = async () => {
  try {
    await productStore.getProductDetail(productId.value)

    if (productStore.productDetail?.category?.id) {
      await fetchRelatedProducts()
    }
  } catch (error) {
    console.error(error)
    showToast(ToastEnum.Error, t('message.error.productNotFound'))
  }
}

const fetchRelatedProducts = async () => {
  try {
    if (!productStore.productDetail?.category?.id) return

    await productStore.getProducts({
      categoryId: productStore.productDetail.category.id,
      page: 1,
      limit: 6,
      searchText: '',
      sortOrder: ProductSort.DESC,
      sortBy: ProductSortBy.CREATED_AT,
    })
  } catch (error) {
    console.error('Error fetching related products:', error)
  }
}

watch(
  () => productId.value,
  async (newId, oldId) => {
    if (newId && (newId !== oldId || !hasInitialized.value)) {
      hasInitialized.value = true
      await fetchProductDetail()
    }
  },
  { immediate: true },
)
</script>
