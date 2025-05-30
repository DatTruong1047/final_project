<template>
  <div
    class="relative h-50 w-50 mb-5 rounded-full overflow-hidden bg-gray-100 border border-white shadow"
  >
    <img

      v-if="user?.media?.url"
      src="/images/avatar-default.jpeg"
      :alt="user!.fullName || 'User'"
      class="h-full w-full object-cover"
    />
    <img
      v-else
      src="/images/avatar-default.jpeg"
      alt="User avatar"
      class="h-full w-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { imageConfig } from '@/configs'
const authStore = useAuthStore()
const user = authStore.user
</script>
