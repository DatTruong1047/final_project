<template>
  <div class="h-full md:h-[70rem] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="rounded-xl shadow-lg border border-gray-100 p-8 w-full max-w-5xl">
      <div class="w-full backdrop-blur-sm rounded-lg">
        <div class="text-center pb-8 pt-8 px-8">
          <div
            class="mx-auto w-16 h-16 md:w-22 md:h-22 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-8 h-8 md:w-14 md:h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          >
            Delivery Information
          </h1>
          <p class="text-gray-600 mt-2 text-sm md:text-lg">
            Please fill in all fields to allow us to deliver to you
          </p>
        </div>
      </div>

      <Form
        @submit="handleSubmit"
        :validation-schema="CreateDeliveryInfoSchema"
        v-slot="{ errors }"
        class="space-y-6"
      >
        <div class="group">
          <label
            for="fullName"
            class="block text-sm md:text-2xl font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
          >
            Full Name <span class="text-red-500">*</span>
          </label>
          <Field
            type="text"
            name="fullname"
            id="fullname"
            v-model="formData.fullname"
            class="w-full text-sm md:text-2xl px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-400"
            placeholder="Enter your full name"
            required
            :class="{ 'is-invalid': errors.fullName }"
          />
          <div class="invalid-feedback text-lg text-red-700">{{ errors.fullName }}</div>
        </div>

        <div class="group">
          <label
            for="phone"
            class="block text-sm md:text-2xl font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
          >
            Phone Number <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <Field
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              v-model="formData.phoneNumber"
              class="w-full text-sm md:text-2xl pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-400"
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              required
              :class="{ 'is-invalid': errors.phoneNumber }"
            />
            <div class="invalid-feedback text-lg text-red-700">{{ errors.phoneNumber }}</div>
          </div>
          <p class="mt-1 text-sm text-gray-500">Example: 0987654321</p>
        </div>

        <div class="group">
          <label
            for="address"
            class="block text-sm md:text-2xl font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
          >
            Delivery Address <span class="text-red-500">*</span>
          </label>
          <Field
            type="text"
            name="address"
            id="address"
            v-model="formData.address"
            rows="3"
            class="w-full h-20 text-sm md:text-xl px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-400 resize-none"
            placeholder="Enter your delivery address (house number, street name, ward/commune, district/city, province)"
            required
            :class="{ 'is-invalid': errors.address }"
          />
          <div class="invalid-feedback text-lg text-red-700">{{ errors.address }}</div>
        </div>

        <div class="group">
          <label
            for="note"
            class="block text-sm md:text-2xl font-medium text-gray-700 mb-1 group-focus-within:text-blue-600 transition-colors"
          >
            Note
          </label>
          <Field
            type="text"
            name="note"
            id="note"
            v-model="formData.note"
            rows="3"
            class="w-full h-40 text-sm md:text-xl px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-400 resize-none"
            placeholder="Enter your note (optional)"
          />
        </div>

        <div class="flex justify-start pt-4">
          <button
            type="submit"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md text-sm md:text-2xl"
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { paymentRoute } from '@/configs/routeConfig'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import type { CreateDeliveryInfoType, CreateOrderType } from '@/types/orderType'
import { Field, Form } from 'vee-validate'
import { CreateDeliveryInfoSchema } from '@/validations/order'

const router = useRouter()
const { showToast } = useToast()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const formData = ref<CreateDeliveryInfoType>({
  fullname: '',
  phoneNumber: '',
  address: '',
  note: '',
})

const handleSubmit = async () => {
  try {
    if (!cartStore.getSelectedCartItems.length) {
      showToast(ToastEnum.Error, 'Please select at least one item in your cart')
      return
    }

    console.log('Form data:', formData.value)

    const cartIds = cartStore.getSelectedCartItems.map((item) => item.id)
    console.log('Selected cart IDs:', cartIds)

    const createOrderRequest: CreateOrderType = {
      cartIds,
      phoneNumber: formData.value.phoneNumber,
      note: formData.value.note,
      fullname: formData.value.fullname,
      address: formData.value.address,
    }

    const result = await orderStore.createOrder(createOrderRequest)
    console.log('Create order result:', result)

    if (orderStore.order) {
      router.push({
        name: paymentRoute.payment,
        params: { clientSecret: orderStore.order.paymentIntent!.clientSecret },
      })
    } else {
      showToast(ToastEnum.Error, 'Failed to create order')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    const errorMessage = error?.message || 'Failed to create order'
    showToast(ToastEnum.Error, errorMessage)
  }
}
</script>
