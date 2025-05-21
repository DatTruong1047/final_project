<template>
  <div class="relative" @mouseenter="isOpen = true" @mouseleave="isOpen = false">
    <!-- Dropdown trigger button -->
    <button
      id="dropdownUserButton"
      class="flex items-center space-x-2 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
      type="button"
    >
      <div class="flex items-center space-x-2">
        <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon class="h-8 w-8 text-gray-600" />
        </div>
      </div>
    </button>

    <!-- Dropdown menu -->
    <div
      id="dropdownUser"
      :class="isOpen ? 'block' : 'hidden'"
      class="absolute z-10 right-0 top-14 bg-white divide-y divide-gray-100 rounded-lg shadow w-50 mt-1 transition-all duration-300"
    >
      <ul class="flex flex-col w-full text-sm text-gray-700" aria-labelledby="dropdownUserButton">
        <template v-if="authStore.isAuthenticated">
          <li class="w-full">
            <RouterLink
              :to="{ name: userRoute.profile }"
              class="block px-4 py-2 mb-1 w-full hover:bg-red-100 text-xl font-medium text-center"
            >
              Profile
            </RouterLink>
          </li>
          <li class="w-full">
            <RouterLink
              :to="{ name: userRoute.orders }"
              class="block px-4 py-2 mb-1 w-full hover:bg-red-100 text-xl font-medium text-center"
            >
              Orders
            </RouterLink>
          </li>
          <li class="w-full">
            <button
              @click="handleLogout"
              class="block px-4 w-full py-2 mb-1 text-xl font-medium hover:bg-red-300 text-center"
            >
              Logout
            </button>
          </li>
        </template>
        <template v-else>
          <li class="w-full">
            <RouterLink
              :to="{ name: authRoute.login }"
              class="block px-4 py-2 mb-1 w-full hover:bg-red-100 text-xl font-medium text-center"
            >
              Login
            </RouterLink>
          </li>
          <li class="w-full">
            <RouterLink
              :to="{ name: authRoute.register }"
              class="block px-4 py-2 mb-1 w-full hover:bg-red-100 text-xl font-medium text-center"
            >
              Register
            </RouterLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDownIcon, UserIcon } from '@heroicons/vue/24/outline'
import { authRoute, userRoute } from '@/configs'
import { useAuthStore } from '@/stores/authStore'
import { UserCircleIcon } from '@heroicons/vue/16/solid'

const authStore = useAuthStore()
const isOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
}
</script>
