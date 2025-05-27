<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-16">
    <div class="mx-auto" v-if="orderStore.order">
      <button
        class="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-transparent px-3 py-2 rounded-md"
        @click="goBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-arrow-left"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back
      </button>

      <div class="grid gap-8 md:grid-cols-5">
        <div class="md:col-span-3 space-y-6">
          <OrderSummary :order="orderStore.order" />
        </div>
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border border-slate-200 sticky top-6">
            <div class="p-6 pb-3">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-credit-card"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Payment Information
              </h3>
              <p class="text-slate-500 text-lg mt-1">
                Enter your card information to complete the payment
              </p>
            </div>
            <div class="p-6 pt-3">
              <div
                v-if="paymentStatus === 'success'"
                class="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center"
              >
                <h3 class="font-semibold text-emerald-700 mb-2">Payment successful!</h3>
                <p class="text-sm text-emerald-600">
                  Thank you for shopping. Your order is being processed.
                </p>
                <button
                  class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium"
                  @click="goToHomePage"
                >
                  Back to home page
                </button>
              </div>
              <PaymentForm
                v-else
                :client-secret="orderStore.order.paymentIntent!.clientSecret"
                @payment-success="handlePaymentSuccess"
                @payment-error="handlePaymentError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import OrderSummary from '@/components/payment/OrderSummary.vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useI18n } from 'vue-i18n'

const orderStore = useOrderStore()
const paymentStatus = ref('idle')
const { showToast } = useToast()
const { t } = useI18n()

const router = useRouter()
const handlePaymentSuccess = () => {
  paymentStatus.value = 'success'
  showToast(ToastEnum.Success, t('message.success.paymentSuccess'))
}

const handlePaymentError = () => {
  paymentStatus.value = 'error'
  showToast(ToastEnum.Error, t('message.error.paymentFailed'))
}

const goBack = () => {
  router.replace('/')
}

const goToHomePage = () => {
  router.replace('/')
}
</script>

<style></style>
