<template>
  <div>
    <div class="flex items-center mb-6">
      <div class="bg-red-600 px-2 py-5 text-xl font-medium rounded mr-2"></div>
      <h2 class="text-3xl font-bold text-red-500">Attributes</h2>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 w-full dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3 sm:text-xl">Specifications</th>
            <th scope="col" class="px-6 py-3 sm:text-xl"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            v-for="(attribute, index) in attributes"
            :key="index"
          >
            <th
              scope="row"
              class="px-6 py-4 sm:text-xl font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ attribute.attributeKey }}
            </th>
            <td class="px-6 py-4 sm:text-xl">
              {{ attribute.attributeValue }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Attribute {
  attributeKey: string
  attributeValue: string
}

defineProps({
  attributes: {
    type: Array as () => Attribute[],
    required: true,
  },
})
</script>
