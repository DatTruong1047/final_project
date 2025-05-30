<template>
  <div class="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen flex justify-center items-start">
    <template v-if="authStore.isAuthenticated">
      <FormComponent />
    </template>
    <div v-else class="flex justify-center items-center h-screen w-full">
      <div>
        <h1 class="text-2xl font-bold">Please login to continue</h1>
        <router-link to="/login" class="text-blue-500 hover:text-blue-600">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormComponent from '@/components/user/profile/FormComponent.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>
