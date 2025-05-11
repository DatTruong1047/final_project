<template>
  <nav
    class="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700 fixed top-0 left-0 right-0 z-40 h-[88px]"
  >
    <div class="max-w-screen-3xl px-4 sm:px-6 lg:px-8 mx-auto h-full">
      <div class="flex justify-between items-center h-full">
        <RouterLink to="/" class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-md flex items-center justify-center text-white font-bold text-2xl"
          >
            E
          </div>
          <span
            class="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent"
          >
            Exclusive
          </span>
        </RouterLink>

        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            to="/"
            class="px-3 py-2 text-2xl text-gray-700 hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            Home
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <RouterLink
            to="/about"
            class="px-3 py-2 text-2xl text-gray-700 hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            About
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <RouterLink
            to="/contact"
            class="px-3 py-2 text-2xl text-gray-700 hover:text-red-600 relative group dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            active-class="text-red-600 dark:text-red-400"
          >
            Contact
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            ></span>
          </RouterLink>

          <div v-if="!isAuthenticated" class="flex items-center ml-4 space-x-4">
            <RouterLink
              :to="{ name: authRoute.register }"
              class="px-3 py-2 text-xl border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900"
            >
              Sign Up
            </RouterLink>

            <RouterLink
              :to="{ name: authRoute.login }"
              class="px-2 py-3 text-xl bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700"
            >
              Sign In
            </RouterLink>
          </div>

          <div v-else class="flex items-center ml-4 space-x-4">
            <RouterLink
              :to="{ name: userRoute.profile }"
              class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            >
              <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <template v-if="authStore.user?.media?.url">
                  <img
                    :src="authStore.user.media.url"
                    alt="Profile"
                    class="w-full h-full rounded-full object-cover"
                  />
                </template>
                <template v-else>
                  <span class="text-4xl font-bold text-gray-600">
                    {{ authStore.user?.fullName?.charAt(0) || authStore.user?.email?.charAt(0) }}
                  </span>
                </template>
              </div>
            </RouterLink>

            <button
              @click="onLogout"
              class="px-3 py-2 text-xl border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        <div class="-mr-2 flex md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-[88px] left-0 right-0 bg-white shadow-lg dark:bg-gray-800"
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

          <!-- Mobile Menu Auth Buttons -->
          <div
            v-if="!isAuthenticated"
            class="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-3 px-3">
              <RouterLink
                :to="{ name: authRoute.register }"
                class="flex-1 px-3 py-2 text-xl text-center border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900"
                @click="isMobileMenuOpen = false"
              >
                Sign Up
              </RouterLink>

              <RouterLink
                :to="{ name: authRoute.login }"
                class="flex-1 px-3 py-2 text-xl text-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md dark:bg-red-600 dark:hover:bg-red-700"
                @click="isMobileMenuOpen = false"
              >
                Sign In
              </RouterLink>
            </div>
          </div>

          <!-- Mobile Menu User Section -->
          <div v-else class="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
            <RouterLink
              :to="{ name: userRoute.profile }"
              class="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-200"
              @click="isMobileMenuOpen = false"
            >
              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <template v-if="authStore.user?.media?.url">
                  <img
                    :src="authStore.user.media.url"
                    alt="Profile"
                    class="w-full h-full rounded-full object-cover"
                  />
                </template>
                <template v-else>
                  <span class="text-xl font-bold text-gray-600">
                    {{ authStore.user?.fullName?.charAt(0) || authStore.user?.email?.charAt(0) }}
                  </span>
                </template>
              </div>
            </RouterLink>

            <button
              @click="onLogout"
              class="w-full px-3 py-2 text-xl text-center border-2 border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-gray-900 mt-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import router from '@/router'
import { authRoute, userRoute } from '@/configs'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const onLogout = () => {
  authStore.logout()
  router.push({ name: authRoute.login })
}

const isMobileMenuOpen = ref(false)
</script>
