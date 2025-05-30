<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-[16rem] py-8">
    <!-- Product content -->

    <div class="flex text-xl font-medium text-red-500 mb-8 items-center space-x-2">
      <span class="hover:text-red-700 cursor-pointer font-bold text-xl uppercase">
        {{ productStore.productDetail?.brand?.name }}
      </span>
      <span class="text-red-400 font-bold flex-shrink-0 text-xl ">•</span>
      <span class="hover:text-red-700 cursor-pointer font-bold text-xl uppercase">
        {{ productStore.productDetail?.category?.name }}
      </span>
    </div>

    <!-- Product Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
      <!-- Product Gallery -->
      <div class="lg:col-span-7">
        <ProductGallery :productMedias="productStore.productDetail?.productMedias || []" />
      </div>
      <!-- Product Info -->
      <div class="lg:col-span-5">
        <ProductInfo
          :product="productStore.productDetail || {}"
          @add-to-cart="onAddToCart"
        />
      </div>
    </div>

    <!-- Product Attributes -->
    <div
      class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
      v-if="productStore.productDetail?.attributes?.length"
    >
      <div class="lg:col-span-7">
        <ProductAttributes :attributes="productStore.productDetail?.attributes || []" />
      </div>
    </div>

    <!-- Product Description -->
    <div class="mb-16" v-if="productStore.productDetail?.longDescription">
      <ProductDescription
        :description="productStore.productDetail?.longDescription || ''"
        :maxLength="300"
      />
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length">
      <RelatedProducts :products="relatedProducts" :productRoute="productRoute.productDetail" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { productRoute } from '@/configs'

import ProductGallery from './ProductGallery.vue'
import ProductInfo from './ProductInfo.vue'
import ProductAttributes from './ProductAttributes.vue'
import ProductDescription from './ProductDescription.vue'
import RelatedProducts from './RelatedProducts.vue'
import { useCartStore } from '@/stores/cartStore'
import type { CartUpsertRequestType } from '@/types/cartType'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const productStore = useProductStore()
const authStore = useAuthStore()

const { showToast } = useToast()
const { t } = useI18n()

const relatedProducts = computed(() => {
  return productStore.products.filter(
    (product) =>
      product.id !== productStore.productDetail?.id &&
      product.category?.id === productStore.productDetail?.category?.id,
  )
})

const onAddToCart = (quantity: number) => {
  try {
    if (productStore.productDetail) {
      const cartRequest: CartUpsertRequestType = {
        productId: productStore.productDetail.id,
        quantity: quantity,
      }
      if (authStore.isAuthenticated) {
        cartStore.addToCart(cartRequest)
        showToast(ToastEnum.Success, t('message.success.addToCartSuccess'))
      } else {
        console.log(authStore)

        showToast(ToastEnum.Error, t('message.error.unauthenticated'))
      }
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    showToast(ToastEnum.Error, t('message.error.addToCartFail'))
  }
}
</script>
