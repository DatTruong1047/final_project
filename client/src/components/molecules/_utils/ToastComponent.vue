<script setup lang="ts">
import { useToastMessageStore } from '@/stores/toastMessageStore'
import { ToastEnum } from '@/types/enum'
import { CheckCircleIcon, ExclamationCircleIcon, BellSnoozeIcon } from '@heroicons/vue/16/solid'
import { computed } from 'vue'

const toastMessageStore = useToastMessageStore()

const containerClass = computed(() => {
  switch (toastMessageStore.toastType) {
    case ToastEnum.Success:
      return 'bg-green-500 dark:bg-green-800 dark:text-green-200'
    case ToastEnum.Info:
      return 'bg-orange-400 dark:bg-orange-700 dark:text-orange-200'
    case ToastEnum.Error:
      return 'bg-red-500 dark:bg-red-800 dark:text-red-200'
    default:
      return 'bg-blue-100 dark:bg-blue-800 dark:text-blue-200'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform -translate-y-10 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-10 opacity-0"
  >
    <div
      v-if="toastMessageStore.isShowToast"
      :class="[
        'fixed left-1/2 transform -translate-x-1/2 z-[100] flex items-center w-full max-w-sm p-4 space-x-4 rtl:space-x-reverse text-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-lg dark:divide-gray-700',
        containerClass,
      ]"
      class="top-[7rem]"
      role="alert"
    >
      <template v-if="toastMessageStore.toastType === ToastEnum.Success">
        <div
          class="text-green-400 dark:text-green-200 inline-flex items-center justify-center shrink-0 w-10 h-10 bg-green-100 rounded-lg"
        >
          <CheckCircleIcon class="h-8" />
        </div>
      </template>

      <template v-else-if="toastMessageStore.toastType === ToastEnum.Info">
        <div
          class="text-orange-400 dark:bg-orange-700 dark:text-orange-200 inline-flex items-center justify-center shrink-0 w-10 h-10 bg-orange-100 rounded-lg"
        >
          <BellSnoozeIcon class="h-8" />
        </div>
      </template>

      <template v-else-if="toastMessageStore.toastType === ToastEnum.Error">
        <div
          class="text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200 inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-lg"
        >
          <ExclamationCircleIcon class="h-8" />
        </div>
      </template>

      <template v-else>
        <div
          class="text-blue-400 bg-blue-100 dark:bg-blue-800 dark:text-blue-200 inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-lg"
        >
          <ExclamationCircleIcon class="h-8" />
        </div>
      </template>
      <div class="ps-4 text-xl text-white font-medium">{{ toastMessageStore.toastMessage }}</div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
