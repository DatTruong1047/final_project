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

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const { showToast } = useToast()
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

const onAddToCart = (productId: string) => {
  console.log(`Added product ${productId} to cart`)
}

const onLoadMore = async () => {
  try {
    const newFilter = { ...filter.value, page: filter.value.page + 1 }
    isLoading.value = true

    await productStore.getProducts(newFilter)
    products.value = [...products.value, ...productStore.products]
  } catch (error) {
    console.error(error)
    showToast(ToastEnum.Error, 'Load products failed')
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
      showToast(ToastEnum.Error, 'Load products failed')
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
    if (categoryStore.selectedCategory && !filter.value.categoryId) {
      filter.value.categoryId = categoryStore.selectedCategory
    }

    if (Object.keys(route.query).length === 0) {
      updateQueryParams()
    } else {
      filter.value = parseQueryParams()
      if (categoryStore.selectedCategory && !filter.value.categoryId) {
        filter.value.categoryId = categoryStore.selectedCategory
      }
    }

    await productStore.getProducts(filter.value)
    showToast(ToastEnum.Success, 'Load products successfully')
  } catch (error) {
    showToast(ToastEnum.Error, 'Load products failed')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="mx-auto px-4 py-8">
    <div class="mb-2">
      <div class="inline-block bg-red-100 text-red-500 px-2 py-1 text-xl font-bold rounded">
        Products
      </div>
    </div>
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-lg md:text-2xl font-bold text-gray-900">Explore Our Products</h2>
    </div>

    <SearchFilterComponent
      :searchText="filter.searchText"
      :sortBy="filter.sortBy"
      :sortOrder="filter.sortOrder"
      @update:searchText="filter.searchText = $event"
      @update:sortBy="filter.sortBy = $event"
      @update:sortOrder="filter.sortOrder = $event"
    />

    <div class="flex justify-center items-center h-80" v-if="isLoading">
      <LoadingComponent />
    </div>
    <template v-else>
      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-xl">No products found</p>
        <p v-if="filter.categoryId" class="text-gray-400 mt-2">
          Try selecting a different category or changing your search criteria
        </p>
      </div>

      <div v-else class="grid mt-8 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <RouterLink
          v-for="product in products"
          :key="product.id"
          :to="{ name: productRoute.productDetail, params: { id: product.id } }"
          class="bg-white rounded-lg md:h-[60rem] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          <!-- Product image -->
          <div
            class="relative bg-white h-40 bg-gray-50 flex items-center justify-center p-4 w-full h-full"
          >
            <img
              :src="product.thumbnail.media.url"
              :alt="product.name"
              class="max-h-full max-w-full object-contain"
            />
          </div>

          <!-- Product details -->
          <div class="p-6 flex-1 flex flex-col">
            <!-- Brand and Category -->
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-lg font-medium text-gray-600 truncate">{{
                product.brand.name
              }}</span>
              <span class="text-gray-400 flex-shrink-0">•</span>
              <span class="text-sm text-gray-600 truncate">{{ product.category.name }}</span>
            </div>

            <h3
              class="text-2xl mt-4 font-semibold text-gray-900 mb-2 line-clamp-2 h-14 overflow-hidden"
            >
              {{ product.name }}
            </h3>

            <div class="mb-3">
              <span class="text-2xl font-bold text-red-600">
                {{
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    product.price,
                  )
                }}
              </span>
            </div>

            <div class="mb-3">
              <h4 class="text-sm font-medium text-gray-900 mb-1">Attributes</h4>
              <div class="text-sm text-gray-600 h-16 overflow-hidden">
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

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3 mt-auto">
              <button
                @click.prevent="onAddToCart(product.id)"
                class="flex-1 font-bold text-2xl bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
              >
                Buy now
              </button>
            </div>
          </div>
        </RouterLink>
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
    </template>
  </section>
</template>
