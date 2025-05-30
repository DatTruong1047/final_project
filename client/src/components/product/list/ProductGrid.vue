<script setup lang="ts">
import { productRoute } from '@/configs'
import { ProductSort, ProductSortBy, type ProductFilterType } from '@/types/productType'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useRouter, useRoute } from 'vue-router'
import SearchFilterComponent from './SearchFilterComponent.vue'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useI18n } from 'vue-i18n'
import { vndFormat } from '@/helpers/processPrice'
import { imageConfig } from '@/configs/image.config'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const { showToast } = useToast()
const { t } = useI18n()

const products = ref(productStore.products)
const isLoading = ref(false)
const isDisabledLoadMore = computed(() => products.value.length >= productStore.total)

const defaultFilter: ProductFilterType = {
  page: 1,
  limit: 8,
  sortOrder: ProductSort.DESC,
  sortBy: ProductSortBy.PRICE,
  searchText: '',
  categoryId: categoryStore.selectedCategory || undefined,
}

const parseQueryParams = (): ProductFilterType => {
  return {
    page: Number(route.query.page) || defaultFilter.page,
    limit: Number(route.query.limit) || defaultFilter.limit,
    sortOrder: (route.query.sortOrder as ProductSort) || defaultFilter.sortOrder,
    sortBy: (route.query.sortBy as ProductSortBy) || defaultFilter.sortBy,
    searchText: (route.query.searchText as string) || defaultFilter.searchText,
    categoryId: (route.query.categoryId as string) || categoryStore.selectedCategory || undefined,
  }
}

const filter = ref<ProductFilterType>(parseQueryParams())

const onScrollBottom = () => {
  const productGrid = document.querySelector('.product-grid')
  if (productGrid) {
    productGrid.scrollTop = productGrid.scrollHeight
  }
}

watch(
  () => categoryStore.selectedCategory,
  (newCategoryId) => {
    if (filter.value.categoryId !== newCategoryId) {
      filter.value.categoryId = newCategoryId || undefined
    }
  },
  { immediate: true },
)

watch(
  () => filter.value.categoryId,
  (newCategoryId) => {
    if (categoryStore.selectedCategory !== newCategoryId && newCategoryId) {
      categoryStore.setSelectedCategory(newCategoryId)
    }
  },
)

const onLoadMore = async () => {
  try {
    const newFilter = { ...filter.value, page: filter.value.page + 1 }
    isLoading.value = true

    await productStore.getProducts(newFilter)
    products.value = [...products.value, ...productStore.products]
  } catch (error) {
    console.error(error)
    showToast(ToastEnum.Error, t('message.error.loadProductsFail'))
  } finally {
    isLoading.value = false
  }
}

const updateQueryParams = () => {
  router.push({
    query: {
      page: filter.value.page.toString(),
      limit: filter.value.limit.toString(),
      sortOrder: filter.value.sortOrder,
      sortBy: filter.value.sortBy,
      searchText: filter.value.searchText || undefined,
      categoryId: filter.value.categoryId || undefined,
    },
  })
}

watch(
  filter,
  async (newFilter) => {
    try {
      await productStore.getProducts(newFilter)
      products.value = productStore.products
      updateQueryParams()
    } catch (error) {
      showToast(ToastEnum.Error, t('message.error.loadProductsFail'))
    } finally {
      isLoading.value = false
    }
  },
  { deep: true },
)

watch(
  () => route.query,
  () => {
    const newFilter = parseQueryParams()

    if (categoryStore.selectedCategory && !newFilter.categoryId) {
      newFilter.categoryId = categoryStore.selectedCategory
    }
    filter.value = newFilter
  },
  { deep: true },
)

onMounted(async () => {
  try {
    isLoading.value = true

    if (Object.keys(route.query).length === 0) {
      updateQueryParams()
    } else {
      filter.value = parseQueryParams()
      if (categoryStore.selectedCategory && !filter.value.categoryId) {
        filter.value.categoryId = categoryStore.selectedCategory
      }
    }
  } catch (error) {
    showToast(ToastEnum.Error, t('message.error.loadProductsFail'))
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="mx-auto px-4 py-8">
    <div class="flex items-center mb-6">
      <div class="bg-red-600 md:px-2 md:py-5 px-1 py-3 text-xl font-medium rounded mr-2"></div>
      <h2 class="md:text-3xl text-2xl font-bold text-red-500">Products</h2>
    </div>
    <SearchFilterComponent
      :searchText="filter.searchText"
      :sortBy="filter.sortBy"
      :sortOrder="filter.sortOrder"
      @update:searchText="filter.searchText = $event"
      @update:sortBy="filter.sortBy = $event"
      @update:sortOrder="filter.sortOrder = $event"
    />

    <div>
      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-xl">No products found</p>
        <p v-if="filter.categoryId" class="text-gray-400 mt-2">
          Try selecting a different category or changing your search criteria
        </p>
      </div>

      <div v-else class="bg-[#e1f4fc] grid py-8 grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-y-8">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="{ name: productRoute.productDetail, params: { id: product.id } }"
          class="bg-white items-center rounded-lg mx-4 md:h-[40rem] overflow-hidden shadow hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300 flex flex-col"
        >
          <!-- Product image -->
          <div
            class="relative pb-8 mb-4 mt-4 p-8 shadow-xs bg-white flex items-center justify-center w-full h-[20rem]"
          >
            <img
              :src="product.thumbnail.media.url || imageConfig.productDefault"
              :alt="product.name"
              class="max-h-full max-w-full object-contain hover:scale-110 transition-all duration-300"
            />
          </div>

          <!-- Product details -->
          <div class="px-6 py-8 flex-1 flex flex-col w-full">
            <!-- Brand and Category -->
            <div class="flex w-full space-x-2 mb-2 text-lg text-gray-600">
              <span class="font-medium truncate uppercase">{{ product.brand.name }}</span>
              <span class="text-gray-400 flex-shrink-0">-</span>
              <span class="truncate font-base uppercase">{{ product.category.name }}</span>
            </div>

            <h3
              class="text-2xl font-semibold text-gray-900 mb-2 line-clamp-2 h-auto overflow-hidden"
            >
              {{ product.name }}
            </h3>

            <div class="mb-1">
              <span class="text-2xl font-bold text-red-600">
                {{ vndFormat(product.price ?? 0) }}
              </span>
            </div>

            <div class="mb-3">
              <div class="text-xl text-gray-600 h-auto overflow-hidden">
                <div v-if="product.shortDescription">
                  <p
                    v-for="(line, index) in product.shortDescription.split('\n').slice(0, 3)"
                    :key="index"
                    class="line-clamp-1"
                  >
                    {{ line }}
                  </p>
                  <span class="text-gray-400 italic">...</span>
                </div>
                <p v-else class="text-gray-400 italic">No description</p>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
      <div class="flex justify-center items-center h-80" v-if="isLoading">
        <LoadingComponent />
      </div>
      <div class="flex justify-center mt-12">
        <button
          class="px-8 py-3 text-white text-xl font-medium rounded-md transition-colors duration-300"
          @click="onLoadMore"
          :class="{
            'opacity-50 cursor-not-allowed bg-gray-400': isDisabledLoadMore,
            'bg-red-600 hover:bg-red-700': !isDisabledLoadMore,
          }"
          :disabled="isDisabledLoadMore"
        >
          View more products
        </button>
      </div>
    </div>
  </section>
</template>
