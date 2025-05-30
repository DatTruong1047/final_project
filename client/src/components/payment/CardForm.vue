<template>
  <div class="space-y-2">
    <div class="flex justify-between items-center">
      <label class="block text-sm sm:text-2xl font-bold text-slate-700">Visa Card</label>
    </div>
    <div class="border rounded-md p-4 bg-white shadow-sm">
      <div id="card-element" ref="cardElementRef"></div>
    </div>

    <div
      v-if="error"
      class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start gap-2"
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
        class="mt-0.5"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <span class="text-sm">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'


defineProps({
  clientSecret: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['card-ready', 'card-error', 'card-change'])

const cardElementRef = ref<HTMLElement | null>(null)
const stripe = ref<any>(null)
const elements = ref<any>(null)
const card = ref<any>(null)
const error = ref('')
const cardComplete = ref(false)

const cardOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'Arial, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
      iconColor: '#4F46E5',
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
}

onMounted(async () => {
  try {
    const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY

    stripe.value = await loadStripe('pk_test_' + stripePublicKey)

    if (stripe.value) {
      elements.value = stripe.value.elements()

      card.value = elements.value.create('card', cardOptions)

      setTimeout(() => {
        if (cardElementRef.value) {
          card.value.mount(cardElementRef.value)

          card.value.on('change', (event: any) => {
            cardComplete.value = event.complete
            error.value = event.error ? event.error.message : ''
            emit('card-change', {
              complete: event.complete,
              error: event.error,
            })
          })

          emit('card-ready', {
            stripe: stripe.value,
            elements: elements.value,
            card: card.value,
          })
        }
      }, 100)
    }
  } catch (err) {
    console.error('Error when initializing Stripe:', err)
    error.value = 'Cannot initialize payment, please try again later.'
    emit('card-error', error.value)
  }
})

defineExpose({
  stripe,
  card,
  cardComplete,
})
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
