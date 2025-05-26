<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Thông tin nhận hàng</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
          Họ và tên người nhận <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          v-model="formData.fullName"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Nhập họ và tên"
          required
        />
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại <span class="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Nhập số điện thoại"
          pattern="[0-9]{10}"
          required
        />
        <p class="mt-1 text-sm text-gray-500">Ví dụ: 0987654321</p>
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ nhận hàng <span class="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          v-model="formData.address"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
          required
        ></textarea>
      </div>

      <div>
        <label for="note" class="block text-sm font-medium text-gray-700 mb-1"> Ghi chú </label>
        <textarea
          id="note"
          v-model="formData.note"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Nhập ghi chú (không bắt buộc)"
        ></textarea>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Tiếp tục
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { paymentRoute } from '@/configs/routeConfig'
import { useToast } from '@/hooks/useToast'
import { ToastEnum } from '@/types/enum'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import type { CreateOrderType } from '@/types/orderType'

const router = useRouter()
const { showToast } = useToast()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const formData = reactive({
  fullName: '',
  phone: '',
  address: '',
  note: '',
})

const handleSubmit = async () => {
  try {
    if (formData.fullName === '' || formData.phone === '' || formData.address === '') {
      showToast(ToastEnum.Error, 'Please fill in all fields')
      return
    }

    if (!cartStore.getSelectedCartItems.length) {
      showToast(ToastEnum.Error, 'Please select at least one item in your cart')
      return
    }

    const cartIds = cartStore.getSelectedCartItems.map((item) => item.id)
    console.log('Selected cart IDs:', cartIds)

    const createOrderRequest: CreateOrderType = {
      cartIds,
      phoneNumber: formData.phone,
      note: formData.note,
    }

    const result = await orderStore.createOrder(createOrderRequest)
    console.log('Create order result:', result)

    if (orderStore.order) {
      router.push({ name: paymentRoute.payment })
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
