<template>
  <nav class="bg-white border-b border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex-shrink-0 flex items-center">
          <RouterLink to="/" class="text-3xl font-bold text-gray-900 dark:text-white">
            Exclusive
          </RouterLink>
        </div>

        <div class="hidden md:flex md:items-center md:space-x-8">
          <RouterLink
            to="/"
            class="text-gray-700 lg:text-2xl hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            Home
          </RouterLink>

          <RouterLink
            to="/about"
            class="text-gray-700 lg:text-2xl hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            About
          </RouterLink>
          <RouterLink
            to="/contact"
            class="text-gray-700 lg:text-2xl hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            Contact
          </RouterLink>
          <RouterLink
            :to="authRoute.register"
            class="text-gray-700 lg:text-2xl hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
          >
            Sign Up
          </RouterLink>
        </div>

        <div class="-mr-2 flex md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                :class="{ hidden: isMobileMenuOpen, 'inline-flex': !isMobileMenuOpen }"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                :class="{ hidden: !isMobileMenuOpen, 'inline-flex': isMobileMenuOpen }"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink
          to="/"
          class="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
        >
          About
        </RouterLink>
        <RouterLink
          to="/contact"
          class="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
        >
          Contact
        </RouterLink>
        <RouterLink
          :to="authRoute.register"
          class="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
        >
          Sign Up
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { authRoute } from '@/configs'

const isMobileMenuOpen = ref(false)
</script>
