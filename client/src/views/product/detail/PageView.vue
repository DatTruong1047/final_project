<template>
  <div>
    <template v-if="productStore.productDetail">
      <ProductDetail />
    </template>
    <template v-else>
      <LoadingComponent />
    </template>
  </div>
</template>

<script setup lang="ts">
import ProductDetail from '@/components/product/detail/ProductDetail.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/productStore'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import router from '@/router'

const route = useRoute()
const productId = route.params.id as string
const productStore = useProductStore()

const isLoading = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    await productStore.getProductDetail(productId)
  } catch (error) {
    console.error(error)
    router.push('/')
  } finally {
    isLoading.value = false
  }
})
</script>
