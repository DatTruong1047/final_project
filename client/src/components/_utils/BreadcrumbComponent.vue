<template>
  <nav class="flex mb-8 text-sm" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li class="inline-flex items-center text-xl font-medium">
        <RouterLink to="/" class="text-red-500 hover:text-red-700 hover:underline rounded-md">
          Home
        </RouterLink>
      </li>
      <li>
        <RouterLink
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :to="{ name: breadcrumb.to }"
          class="text-red-500 hover:text-red-700 text-xl font-medium hover:underline rounded-md"
        >
          <span class="mx-1 text-red-300">/</span>
          {{ breadcrumb.label }}
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface Breadcrumb {
  to: string
  label: string
}

defineProps<{
  breadcrumbs: Breadcrumb[]
}>()
</script>
