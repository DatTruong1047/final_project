<template>
  <div
    v-if="isOpen"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full backdrop-blur-sm"
  >
    <div class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
        <button
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          @click="closeModal"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-6 text-center">
          <svg
            class="mx-auto mb-4 text-red-500 w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
            {{ title }}
          </h3>
          <p class="mb-5 text-xl text-gray-500 dark:text-gray-300">
            {{ message }}
          </p>
          <button
            type="button"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-xl inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="confirmAction"
          >
            {{ confirmText }}
          </button>
          <button
            type="button"
            class="text-gray-800 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-xl font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="closeModal"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Are you sure?',
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item?',
  },
  confirmText: {
    type: String,
    default: "Yes, I'm sure",
  },
  cancelText: {
    type: String,
    default: 'No, cancel',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
  document.body.classList.add('modal-open')
}

const closeModal = () => {
  isOpen.value = false
  document.body.classList.remove('modal-open')
  emit('cancel')
}

const confirmAction = () => {
  emit('confirm')
  isOpen.value = false
  document.body.classList.remove('modal-open')
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<style scoped lang="scss">
@use '@/css/atoms/_utils/_confirm-modal.scss';
</style>
