<template>
  <div
    class="relative h-40 w-40 mb-5 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow"
  >
    <img
      v-if="user.media?.url"
      :src="user.media.url"
      :alt="user.fullName || 'User'"
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

<script setup>
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const user = authStore.user
</script>
