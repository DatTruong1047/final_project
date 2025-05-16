<template>
  <div class="text-center py-16">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">You need to login first</h2>
    <p class="text-xl text-gray-600 mb-8">Please login to use this feature</p>
    <RouterLink
      :to="{ name: authRoute.login }"
      class="px-6 py-3 text-2xl bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 shadow-md hover:shadow-lg"
    >
      Login
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { authRoute } from '@/configs'
</script>
