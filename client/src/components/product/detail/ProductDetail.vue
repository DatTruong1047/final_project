<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex text-xl font-medium text-red-500 mb-8 items-center space-x-2 mb-2">
      <span class="hover:text-red-700 cursor-pointer">
        {{ productStore.productDetail?.brand?.name }}
      </span>
      <span class="text-gray-400 font-bold flex-shrink-0">•</span>
      <span class="hover:text-red-700 cursor-pointer">
        {{ productStore.productDetail?.category?.name }}
      </span>
    </div>

    <!-- Product Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
      <!-- Product Gallery -->
      <div class="lg:col-span-7">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex md:flex-col flex-row gap-4 order-2 md:order-1">
            <div
              v-for="(image, index) in productStore.productDetail?.productMedias.slice(0, 4)"
              :key="index"
              class="w-16 h-16 sm:w-28 sm:h-28 border-gray-200 rouded"
              :class="{ 'border-2 border-red-500': selectedImageIndex === index }"
              @click="selectedImageIndex = index"
            >
              <img
                :src="image.media.url"
                :alt="`Product Image ${image.id}`"
                class="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          <!-- Main image -->
          <div class="flex-1 bg-gray-50 rounded-lg order-1 md:order-2">
            <div class="relative w-full h-full">
              <img
                :src="productStore.productDetail?.productMedias[selectedImageIndex].media.url"
                :alt="`Product Image ${productStore.productDetail?.productMedias[selectedImageIndex].id}`"
                class="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Product Info -->
      <div class="lg:col-span-5">
        <!-- Name -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ productStore.productDetail?.name }}
        </h1>
        <!-- Price -->
        <div class="flex items-center mb-4 text-red-500 font-bold text-2xl sm:text-4xl">
          <span class="">
            {{ vndFormat(productStore.productDetail?.price || 0) }}
          </span>
        </div>
        <!-- Short Description -->
        <div class="flex items-start mb-4">
          <span class="text-gray-900 text-2xl">
            <p
              v-for="(line, index) in productStore.productDetail?.shortDescription
                ?.split('\n')
                .slice(0, 3)"
              :key="index"
              class="line-clamp-1"
            >
              - {{ line }}
            </p>
          </span>
        </div>

        <hr class="my-8 text-gray-400" />

        <!-- Add to cart -->
        <div class="flex items-center gap-4 mb-8">
          <!-- Quantity -->
          <div class="flex items-center sm:px-4 sm:py-4 border border-gray-300 rounded-md">
            <button class="px-3 py-1 text-gray-600 hover:bg-gray-100" @click="decrementQuantity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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
              class="w-12 text-center text-xl sm:text-2xl font-medium border-0 focus:ring-0"
            />
            <button class="px-3 py-2 text-gray-600 hover:bg-gray-100" @click="incrementQuantity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
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
            class="flex bg-green-600 text-lg md:text-2xl font-bold text-white px-2 py-2 sm:px-4 sm:py-5 hover:bg-green-500 transition-colors duration-300 rounded-md cursor-pointer"
          >
            Add to cart
          </button>
          <button
            class="flex bg-red-500 text-lg md:text-2xl font-bold text-white px-2 py-2 sm:px-4 sm:py-5 hover:bg-red-600 transition-colors duration-300 rounded-md cursor-pointer"
          >
            Buy now
          </button>
        </div>

        <!-- Delivery Infor -->
        <div class="border border-gray-300 rounded-lg mb-8">
          <!-- Free Delivery -->
          <div class="flex items-center p-4 border-b border-gray-200">
            <div class="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                />
              </svg>
            </div>

            <div>
              <h3 class="font-medium text-2xl">Free Delivery</h3>
              <p class="text-sm text-gray-500 text-xl">
                Enter your postal code for Delivery Availability
              </p>
            </div>
          </div>

          <!-- Return Delivery -->
          <div class="flex items-center p-4">
            <div class="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-2xl">Return Delivery</h3>
              <p class="text-sm text-gray-500 text-xl">Free 30 Days Delivery Returns. Details</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Long Description -->
    <div>
      <div class="flex items-center mb-6">
        <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
        <h2 class="text-3xl font-bold text-red-500">Attributes</h2>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
      <div class="lg:col-span-7">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 w-full dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3 sm:text-xl">Specifications</th>
                <th scope="col" class="px-6 py-3 sm:text-xl"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                v-for="(attribute, index) in productStore.productDetail?.attributes"
                :key="index"
              >
                <th
                  scope="row"
                  class="px-6 py-4 sm:text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {{ attribute.attributeKey }}
                </th>
                <td class="px-6 py-4 sm:text-xl">
                  {{ attribute.attributeValue }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--Related Product Section -->
    <div>
      <div class="flex items-center mb-6">
        <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
        <h2 class="text-3xl font-bold text-red-500">Information</h2>
      </div>
    </div>
    <div class="lg:col-span-5">
      <div
        class="p-5 text-base sm:text-xl font-sans leading-relaxed text-gray-700 bg-white dark:text-white dark:bg-gray-800 text-justify"
      >
        <p v-if="!showFullDescription">
          {{ truncatedDescription }}<span v-if="isTruncatable">...</span>
          <button
            v-if="isTruncatable"
            @click="showFullDescription = true"
            class="text-red-500 font-medium hover:underline ml-2"
          >
            View more
          </button>
        </p>
        <p v-else>
          {{ productStore.productDetail?.longDescription }}
          <button
            @click="showFullDescription = false"
            class="text-red-500 font-medium hover:underline ml-2"
          >
            View less
          </button>
        </p>
      </div>
    </div>

    <!--Related Product Section -->
    <div>
      <div class="flex items-center mb-6">
        <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
        <h2 class="text-3xl font-bold text-red-500">Related Items</h2>
      </div>
    </div>

    <div class="grid grid-cols-2 bg-gray-50 lg:grid-cols-3 gap-2 mb-16">
      <RouterLink
        class="bg-red-50 rounded overflow-hidden group hover:shadow-md transition-shadow duration-500"
        v-for="product in relatedProducts"
        :key="product.id"
        :to="{ name: productRoute.productDetail, params: { id: product.id } }"
      >
        <div class="relative bg-white h-64">
          <img
            :src="product.thumbnail.media.url"
            :alt="`Product Image ${product.name}`"
            class="w-full h-full object-contain p-4"
          />
        </div>
        <div class="p-4 h-40">
          <h3 class="text-lg font-medium">
            <span class="text-gray-500">
              {{ product.brand?.name }}
            </span>
          </h3>
          <h2 class="text-lg sm:text-2xl h-16 font-medium">{{ product.name }}</h2>

          <div class="flex items-center justify-between mb-2">
            <div>
              <span class="text-red-500 font-medium mr-2 text-2xl">
                {{ vndFormat(product.price) }}
              </span>
            </div>

            <div class="flex">
              <div class="flex">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
              <span class="text-xs text-gray-500 ml-1"> 100 </span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { vndFormat } from '@/helpers/processPrice'
import { productRoute } from '@/configs'

const productStore = useProductStore()
const selectedImageIndex = ref(0)
const quantity = ref(1)
const { showToast } = useToast()

const showFullDescription = ref(false)

const truncatedDescription = computed(() => {
  const fullText = productStore.productDetail?.longDescription || ''
  return fullText.length > 300 ? fullText.slice(0, 300) : fullText
})

const isTruncatable = computed(() => {
  return (productStore.productDetail?.longDescription?.length || 0) > 300
})

const relatedProducts = computed(() => {
  return productStore.products.filter((product) => product.id !== productStore.productDetail?.id)
})

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
