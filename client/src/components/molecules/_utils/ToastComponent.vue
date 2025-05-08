<script setup lang="ts">
import { ToastEnum } from '@/types/enum'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/16/solid'

defineProps<{
  message: string
  type: ToastEnum
}>()
</script>

<template>
  <div
    id="toast-success"
    class="flex items-center bg-sky-50 w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <div>
      <template v-if="type === ToastEnum.Success">
        <div
          class="inline-flex items-center justify-center shrink-0 w-10 h-10 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
        >
          <CheckCircleIcon class="h-5" />
        </div>
      </template>

      <template v-else-if="type === ToastEnum.Info">
        <div
          class="inline-flex items-center justify-center shrink-0 w-10 h-10 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200"
        >
          <InformationCircleIcon class="h-5" />
        </div>
      </template>

      <template v-else>
        <div
          class="inline-flex items-center justify-center shrink-0 w-10 h-10 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
        >
          <ExclamationCircleIcon class="h-8" />
        </div>
      </template>
    </div>

    <div class="ms-3 text-sm font-normal">{{ message }}</div>
  </div>
</template>
