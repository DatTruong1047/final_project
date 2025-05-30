<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()

const selectedCategory = computed({
  get: () => categoryStore.selectedCategory,
  set: (value) => {
    categoryStore.setSelectedCategory(value)
  },
})

onMounted(async () => {
  try {
    if (categoryStore.categories.length > 0 && !categoryStore.selectedCategory) {
      selectedCategory.value = categoryStore.categories[0].id
    }
    updateSliderMeasurements()
    nextTick(() => {
      scrollToSelectedCategory()
    })
  } catch (error) {
    showToast(ToastEnum.Error, t('message.error.loadCategoriesFail'))
  }
})

watch(() => categoryStore.categories, updateSliderMeasurements, { deep: true })

watch(selectedCategory, () => {
  scrollToSelectedCategory()
})

const scrollPosition = ref(0)
const sliderRef = ref(null)
const visibleWidth = ref(0)
const totalWidth = ref(0)

const showLeftArrow = computed(() => scrollPosition.value > 0)
const showRightArrow = computed(() => {
  return scrollPosition.value < totalWidth.value - visibleWidth.value
})

function updateSliderMeasurements() {
  nextTick(() => {
    if (sliderRef.value) {
      visibleWidth.value = sliderRef.value.clientWidth
      totalWidth.value = sliderRef.value.scrollWidth
    }
  })
}

const onScrollLeft = () => {
  if (sliderRef.value) {
    const newPosition = Math.max(0, scrollPosition.value - 300)
    sliderRef.value.scrollTo({ left: newPosition, behavior: 'smooth' })
    scrollPosition.value = newPosition
  }
}

const onScrollRight = () => {
  if (sliderRef.value) {
    const newPosition = Math.min(totalWidth.value - visibleWidth.value, scrollPosition.value + 300)
    sliderRef.value.scrollTo({ left: newPosition, behavior: 'smooth' })
    scrollPosition.value = newPosition
  }
}

const scrollToSelectedCategory = () => {
  if (!sliderRef.value || !selectedCategory.value) return

  const selectedEl = sliderRef.value.querySelector(`[data-category-id="${selectedCategory.value}"]`)
  if (!selectedEl) return

  const containerWidth = sliderRef.value.clientWidth
  const itemLeft = selectedEl.offsetLeft
  const itemWidth = selectedEl.offsetWidth

  const targetPosition = Math.max(
    0,
    Math.min(itemLeft - containerWidth / 2 + itemWidth / 2, totalWidth.value - visibleWidth.value),
  )

  sliderRef.value.scrollTo({
    left: targetPosition,
    behavior: 'smooth',
  })

  scrollPosition.value = targetPosition
}

const onScroll = (event) => {
  scrollPosition.value = event.target.scrollLeft
}

const onSelectCategory = (id) => {
  selectedCategory.value = id
}

const getCategoryIcon = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>`
}
</script>

<template>
  <div class="mx-auto px-4 py-8 mt-10">
    <div class="flex items-center mb-6">
      <div class="flex-1">
        <div class="flex items-center mb-6">
          <div class="bg-red-600 md:px-2 md:py-5 px-1 py-3 text-xl font-medium rounded mr-2"></div>
          <h2 class="md:text-3xl text-2xl font-bold text-red-500">Categories</h2>
        </div>
      </div>

      <div class="hidden sm:flex items-center space-x-2">
        <button
          @click="onScrollLeft"
          class="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          :class="{
            'opacity-50 cursor-not-allowed': !showLeftArrow,
            'cursor-pointer': showLeftArrow,
          }"
          :disabled="!showLeftArrow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          @click="onScrollRight"
          class="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          :class="{
            'opacity-50 cursor-not-allowed': !showRightArrow,
            'cursor-pointer': showRightArrow,
          }"
          :disabled="!showRightArrow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="categoryStore.categories.length === 0" class="text-center py-8">
      <p class="text-gray-500">Loading categories...</p>
    </div>

    <div v-else class="relative bg-white px-4">
      <button
        v-if="showLeftArrow"
        @click="onScrollLeft"
        class="sm:hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div
        ref="sliderRef"
        @scroll="onScroll"
        class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth py-4"
        style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch"
      >
        <div
          v-for="category in categoryStore.categories"
          :key="category.id"
          :data-category-id="category.id"
          @click="onSelectCategory(category.id)"
          class="flex flex-col items-center justify-center min-w-[120px] h-[120px] mx-2 first:ml-0 last:mr-0 rounded-lg border transition-all duration-200 snap-start cursor-pointer"
          :class="
            selectedCategory === category.id
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-700 border-gray-200 hover:border-red-200'
          "
        >
          <div class="mb-2" v-html="getCategoryIcon()"></div>
          <span class="text-xl mt-2 font-medium">{{ category.name }}</span>
        </div>
      </div>

      <button
        v-if="showRightArrow"
        @click="onScrollRight"
        class="sm:hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
