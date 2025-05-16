<template>
  <div id="default-carousel" class="relative w-full" data-carousel="slide">
    <!-- Carousel wrapper -->
    <div class="relative h-full overflow-hidden rounded-lg md:h-[40rem]">
      <!-- Carousel items -->
      <div
        v-for="(image, index) in imageConfig.bannerImage"
        :key="index"
        class="duration-700 ease-in-out w-full h-full"
        :data-carousel-item="index === 0 ? 'active' : ''"
      >
        <img
          :src="image"
          class="absolute md:h-[40rem] block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          :alt="`Banner ${index + 1}`"
        />
      </div>

      <!-- Slider controls -->
      <button
        type="button"
        class="absolute top-1/2 -translate-y-1/2 start-0 z-30 flex items-center justify-center px-6 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
        >
          <svg
            class="w-4 h-4 md:w-6 md:h-6 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        class="absolute top-1/2 -translate-y-1/2 end-0 z-30 flex items-center justify-center px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span
          class="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
        >
          <svg
            class="w-4 h-4 md:w-6 md:h-6 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    </div>

    <!-- Slider indicators -->
    <div
      class="absolute z-30 flex -translate-x-1/2 bottom-0 left-1/2 space-x-3 rtl:space-x-reverse"
    >
      <button
        v-for="(_, index) in imageConfig.bannerImage"
        :key="index"
        type="button"
        class="w-3 h-3 md:w-4 md:h-4 rounded-full mb-2"
        :aria-current="index === 0 ? 'true' : 'false'"
        :aria-label="`Slide ${index + 1}`"
        :data-carousel-slide-to="index"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { imageConfig } from '@/configs'
import { onMounted, onActivated } from 'vue'
import { initCarousels } from 'flowbite'

onMounted(() => {
  initCarousels()
})
</script>
