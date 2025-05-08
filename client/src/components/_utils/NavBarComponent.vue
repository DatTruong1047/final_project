<template>
  <nav
    class="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-50"
  >
    <div class="max-w-screen-3xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div class="flex justify-between h-16">
        <div class="flex-shrink-0 flex items-center">
          <RouterLink to="/" class="flex items-center gap-2">
            <!-- Logo icon -->
            <div
              class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center text-white font-bold"
            >
              E
            </div>
            <span
              class="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"
            >
              Exclusive
            </span>
          </RouterLink>
        </div>

        <div class="hidden md:flex md:items-center md:space-x-1 lg:space-x-8">
          <RouterLink
            to="/"
            class="px-3 py-2 text-gray-700 text-xl lg:text-base hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            Home
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <RouterLink
            to="/about"
            class="px-3 py-2 text-gray-700 text-xl lg:text-base hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            About
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <RouterLink
            to="/contact"
            class="px-3 py-2 text-gray-700 text-xl lg:text-base hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            Contact
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <div class="flex items-center ml-4 space-x-4">
            <RouterLink
              :to="authRoute.register"
              class="px-4 py-2 text-xl lg:text-base border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900"
            >
              Sign Up
            </RouterLink>

            <RouterLink
              :to="authRoute.login"
              class="px-4 py-2 text-xl lg:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700"
            >
              Sign In
            </RouterLink>
          </div>
        </div>

        <div class="-mr-2 flex md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-100 focus:outline-none transition-colors duration-200 dark:text-gray-400 dark:hover:bg-gray-800"
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

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-white shadow-lg rounded-b-lg dark:bg-gray-800"
      >
        <div class="px-4 pt-2 pb-3 space-y-2">
          <RouterLink
            to="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
            active-class="text-red-500 bg-gray-50 dark:bg-gray-700 dark:text-red-400"
            @click="isMobileMenuOpen = false"
          >
            Home
          </RouterLink>

          <RouterLink
            to="/about"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
            active-class="text-red-500 bg-gray-50 dark:bg-gray-700 dark:text-red-400"
            @click="isMobileMenuOpen = false"
          >
            About
          </RouterLink>

          <RouterLink
            to="/contact"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
            active-class="text-red-500 bg-gray-50 dark:bg-gray-700 dark:text-red-400"
            @click="isMobileMenuOpen = false"
          >
            Contact
          </RouterLink>

          <div class="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3 px-3">
              <RouterLink
                :to="authRoute.register"
                class="flex-1 px-4 py-2 text-center border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900"
                @click="isMobileMenuOpen = false"
              >
                Sign Up
              </RouterLink>

              <RouterLink
                :to="authRoute.login"
                class="flex-1 px-4 py-2 text-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md dark:bg-red-600 dark:hover:bg-red-700"
                @click="isMobileMenuOpen = false"
              >
                Sign In
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { authRoute } from '@/configs'

const isMobileMenuOpen = ref(false)
</script>
