<template>
  <nav class="flex mb-8 text-sm" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li class="inline-flex items-center text-2xl font-medium">
        <router-link to="/" class="text-red-500 hover:text-red-700 hover:underline rounded-md">
          Home
        </router-link>
      </li>
      <li>
        <router-link
          v-for="breadcrumb in breadcrumbs"
          :to="breadcrumb.to"
          class="text-red-500 hover:text-red-700 text-2xl font-medium hover:underline rounded-md"
        >
          <span class="mx-1 text-red-300">/</span>
          {{ breadcrumb.label }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  breadcrumbs: {
    to: string
    label: string
  }[]
}>()
</script>
