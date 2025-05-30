<template>
  <div class="flex gap-3 items-start">
    <img :src="botImage" class="w-10 h-10 rounded-full" alt="bot" />
    <div>
      <div
        class="bg-gray-200 p-4 text-gray-900 text-xl md:text-2xl rounded-xl max-w-2xl animate-fade-in"
        v-text="props.message"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { paymentRoute } from '@/configs'
import { imageConfig } from '@/configs/image.config'
import router from '@/router'
import { useOrderStore } from '@/stores/orderStore'


const botImage = imageConfig.botImage
const orderStore = useOrderStore()


const props = defineProps<{
  message: string
  tool: string
}>()


</script>

<style lang="scss"></style>
