<template>
  <div class="relative">
    <!-- Dropdown trigger button -->
    <button
      id="dropdownUserButton"
      @click="toggleDropdown"
      class="flex items-center space-x-2 text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
      type="button"
    >
      <div class="flex items-center space-x-2">
        <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white/20">
          <UserIcon class="h-8 w-8 text-gray-600" />
        </div>
      </div>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      id="dropdownUser"
      class="absolute z-10 right-0 top-14 bg-white rounded-xl shadow-lg w-64 mt-2 transition-all duration-800 ease-out"
    >
      <div class="p-3">
        <ul class="flex flex-col w-full text-base text-gray-700" aria-labelledby="dropdownUserButton">
          <template v-if="authStore.isAuthenticated">
            <li class="w-full">
              <RouterLink
                :to="{ name: userRoute.profile }"
                class="flex items-center px-4 py-4 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <UserCircleIcon class="w-8 h-8 mr-3" />
                <span class="font-medium text-xl">Profile</span>
              </RouterLink>
            </li>
            <li class="w-full">
              <RouterLink
                :to="{ name: orderRoute.order }"
                class="flex items-center px-4 py-4 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="font-medium text-xl">Orders</span>
              </RouterLink>
            </li>
            <div class="border-t border-gray-100 my-2"></div>
            <li class="w-full">
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-4 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="font-medium text-xl">Logout</span>
              </button>
            </li>
          </template>
          <template v-else>
            <li class="w-full">
              <RouterLink
                :to="{ name: authRoute.login }"
                class="flex items-center px-4 py-4 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span class="font-medium text-lg">Login</span>
              </RouterLink>
            </li>
            <li class="w-full">
              <RouterLink
                :to="{ name: authRoute.register }"
                class="flex items-center px-4 py-4 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span class="font-medium text-lg">Register</span>
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon, UserIcon } from '@heroicons/vue/24/outline'
import { authRoute, userRoute, orderRoute } from '@/configs'
import { useAuthStore } from '@/stores/authStore'
import { UserCircleIcon } from '@heroicons/vue/16/solid'

const authStore = useAuthStore()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  const dropdown = document.getElementById('dropdownUser')
  const button = document.getElementById('dropdownUserButton')

  if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  authStore.logout()
  isOpen.value = false
  router.push({ name: authRoute.login })
}
</script>
