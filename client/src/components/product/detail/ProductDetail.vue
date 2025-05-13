<template>
  <div class="mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-32">
      <div class="w-full lg:w-1/2">
        <div class="relative bg-white flex items-center justify-center rounded-lg aspect-video">
          <img
            v-if="productStore.productDetail?.productMedias?.length"
            :src="productStore.productDetail?.productMedias[selectedImageIndex].media.url"
            alt="Ảnh sản phẩm"
            class="w-full h-full object-contain max-h-96 lg:max-h-[600px] transition-all duration-300 ease-in-out"
          />

          <!-- Nút điều hướng -->
          <button
            @click="prevImage"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 shadow-md"
          >
            ‹
          </button>
          <button
            @click="nextImage"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 shadow-md"
          >
            ›
          </button>
        </div>
      </div>

      <!-- Right Column - Product Info -->
      <div class="w-full lg:w-2/5">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ productStore.productDetail?.name }}
        </h1>
        <div class="flex items-center justify-start mb-6 gap-6">
          <div class="text-xl font-medium">Mã sản phẩm: {{ productStore.productDetail?.code }}</div>
          <div class="text-xl font-medium">
            Thương hiệu: {{ productStore.productDetail?.brand.name }}
          </div>
        </div>
        <div class="text-3xl font-bold text-red-600 mb-6">
          Giá bán:
          {{
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              productStore.productDetail!.price,
            )
          }}
        </div>
        <div class="mb-6">
          <h3 class="text-xl font-medium text-gray-900 mb-2">Tính năng nổi bật:</h3>
          <div
            class="text-xl text-gray-600 space-y-2"
            v-if="productStore.productDetail?.shortDescription"
          >
            <p
              v-for="(line, index) in productStore.productDetail!.shortDescription!.split('\n')"
              :key="index"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <!-- Quantity and Add to Cart -->
        <div class="flex items-center gap-4 mb-6">
          <div class="flex border border-gray-300 rounded-md">
            <button
              class="px-2 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
              @click="decrementQuantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="text"
              v-model="quantity"
              class="w-12 text-center border-x border-gray-300 focus:outline-none text-2xl"
              readonly
            />
            <button
              class="px-2 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
              @click="incrementQuantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
          <button
            class="bg-red-500 w-64 hover:bg-red-600 text-white py-2 px-6 rounded-md text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            @click="addToCart"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'

const productStore = useProductStore()
const selectedImageIndex = ref(0)
const quantity = ref(1)
const { showToast } = useToast()

const addToCart = () => {
  if (productStore.productDetail) {
    console.log(
      `Đã thêm sản phẩm ${productStore.productDetail.id} vào giỏ hàng với số lượng ${quantity.value}`,
    )

    showToast(ToastEnum.Success, 'Đã thêm sản phẩm vào giỏ hàng')
  }
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const prevImage = () => {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--
  }
}

const nextImage = () => {
  const total = productStore.productDetail?.productMedias?.length || 0
  if (selectedImageIndex.value < total - 1) {
    selectedImageIndex.value++
  }
}
</script>
