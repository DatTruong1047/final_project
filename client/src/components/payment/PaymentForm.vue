<template>
  <div>
    <PaymentSuccess
      v-if="paymentSuccess"
      :payment-id="paymentIntentId"
      :payment-date="paymentDate"
      @complete="$emit('payment-complete')"
    />

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <CardForm
        ref="cardFormRef"
        :client-secret="props.clientSecret"
        @card-ready="handleCardReady"
        @card-change="handleCardChange"
        @card-error="handleCardError"
      />

      <SubmitButton :disabled="!cardComplete || loading" :loading="loading" />

      <ProcessingIndicator :processing="processing" />

      <PaymentFooter />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardForm from './CardForm.vue'
import PaymentSuccess from './PaymentSuccess.vue'
import PaymentFooter from './PaymentFooter.vue'
import ProcessingIndicator from './ProcessingIndicator.vue'
import SubmitButton from './SubmitButton.vue'

const props = defineProps({
  clientSecret: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['payment-success', 'payment-error', 'payment-complete'])

const cardFormRef = ref<InstanceType<typeof CardForm> | null>(null)
const stripe = ref<any>(null)
const card = ref<any>(null)
const error = ref('')
const loading = ref(false)
const cardComplete = ref(false)
const processing = ref(false)
const paymentSuccess = ref(false)
const paymentIntentId = ref('')
const paymentDate = ref('')

const handleCardReady = (cardData: any) => {
  stripe.value = cardData.stripe
  card.value = cardData.card
}

const handleCardChange = (cardStatus: any) => {
  cardComplete.value = cardStatus.complete
  error.value = cardStatus.error ? cardStatus.error.message : ''
}

const handleCardError = (errorMessage: string) => {
  error.value = errorMessage
  emit('payment-error')
}

const handleSubmit = async () => {
  if (!stripe.value || !card.value) {
    error.value = 'Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.'
    return
  }

  loading.value = true
  error.value = ''
  processing.value = true

  try {
    const { error: confirmError, paymentIntent } = await stripe.value.confirmCardPayment(
      props.clientSecret,
      {
        payment_method: {
          card: card.value,
          billing_details: {
            name: 'Khách hàng',
          },
        },
      },
    )

    if (confirmError) {
      error.value = confirmError.message || 'Đã xảy ra lỗi khi xử lý thanh toán'
      emit('payment-error')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      paymentSuccess.value = true
      paymentIntentId.value = paymentIntent.id
      paymentDate.value = new Date().toLocaleString('vi-VN')
      emit('payment-success', paymentIntent)
    }
  } catch (err: any) {
    error.value = err.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
    emit('payment-error')
  } finally {
    loading.value = false
    processing.value = false
  }
}
</script>

<style>
.StripeElement {
  height: 40px;
  padding: 10px 12px;
  width: 100%;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
