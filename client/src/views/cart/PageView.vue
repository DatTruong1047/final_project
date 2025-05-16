<template>
  <div class="flex h-[100vh] justify-center items-center" v-if="cartStore.loading.cart">
    <LoadingComponent />
  </div>

  <div v-else class="mx-auto px-4 py-8 h-full min-h-screen bg-gray-50">
    <BreadcrumbComponent :breadcrumbs="breadcrumbs" />

    <UnAuthenComponent v-if="!authStore.isAuthenticated" />

    <template v-else>
      <!-- Empty Cart Message -->
      <CartEmptyComponent v-if="!data.carts || data.carts.length === 0" />

      <div v-else class="lg:grid lg:grid-cols-3 lg:gap-8">
        <div class="lg:col-span-2">
          <CartListComponent
            :data="data"
            :on-increase-quantity="onIncreaseQuantity"
            :on-decrease-quantity="onDecreaseQuantity"
            :on-remove-item="onRemoveItem"
          />

          <div class="flex justify-between mb-8">
            <RouterLink
              to="/"
              class="py-2.5 px-5 text-xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-200"
            >
              Return To Shop
            </RouterLink>
          </div>
        </div>

        <!-- Cart Summary  -->
        <CartSummaryComponent :cart-total="cartTotal" v-if="data.carts && data.carts.length > 0" />
      </div>
    </template>
  </div>

  <ConfirmModal
    ref="confirmModal"
    @confirm="confirmDelete"
    title="Xóa sản phẩm"
    :message="`Bạn có chắc chắn muốn xóa sản phẩm '${productToDeleteName}' khỏi giỏ hàng?`"
    confirmText="Xóa"
    cancelText="Hủy"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ToastEnum } from '@/types/enum'
import { useToast } from '@/hooks/useToast'
import { useI18n } from 'vue-i18n'

import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { cartRoute } from '@/configs'

import ConfirmModal from '@/components/atoms/_utils/ConfirmModal.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import BreadcrumbComponent from '@/components/_utils/BreadcrumbComponent.vue'
import CartEmptyComponent from '@/components/cart/CartEmptyComponent.vue'
import CartListComponent from '@/components/cart/CartListComponent.vue'
import CartSummaryComponent from '@/components/cart/CartSummaryComponent.vue'
import UnAuthenComponent from '@/components/_utils/UnAuthenComponent.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const { showToast } = useToast()
const { t } = useI18n()

const breadcrumbs = computed(() => [{ label: 'Cart', to: cartRoute.cart }])

const confirmModal = ref<any>(null)
const productToDelete = ref<string | null>(null)
const productToDeleteName = ref<string>('')

const changedList = ref<Record<string, number>>({})

const data = computed(() => cartStore.cart)

const cartTotal = computed(() => {
  return (data.value.carts || []).reduce((total, item) => {
    return total + item.product.price * item.quantity
  }, 0)
})

const updateChangedList = (id: string, quantity: number) => {
  changedList.value[id] = quantity
}

const onIncreaseQuantity = (id: string) => {
  try {
    if (!data.value.carts) return

    const cart = data.value.carts.find((cart) => cart.id === id)
    if (cart) {
      cartStore.updateCart({
        id: cart.id,
        count: cart.quantity + 1,
      })
      updateChangedList(cart.id, cart.quantity + 1)
    }
  } catch (error) {
    console.error('Error increasing quantity:', error)
    showToast(ToastEnum.Error, t('message.error.updateCartFail'))
  }
}

const onDecreaseQuantity = (id: string) => {
  try {
    if (!data.value.carts) return

    const cart = data.value.carts.find((cart) => cart.id === id)
    if (cart) {
      if (cart.quantity > 1) {
        cartStore.updateCart({
          id: cart.id,
          count: cart.quantity - 1,
        })
        updateChangedList(cart.id, cart.quantity - 1)
      } else {
        productToDelete.value = id
        productToDeleteName.value = cart.product.name
        confirmModal.value?.openModal()
      }
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error)
    showToast(ToastEnum.Error, t('message.error.updateCartFail'))
  }
}

const onRemoveItem = (id: string) => {
  if (!data.value.carts) return

  const cart = data.value.carts.find((item) => item.id === id)
  if (cart) {
    productToDelete.value = id
    productToDeleteName.value = cart.product.name
    confirmModal.value?.openModal()
  }
}

const confirmDelete = () => {
  try {
    if (!data.value.carts) return

    const id = productToDelete.value
    if (!id) return

    cartStore.removeFromCart(id)
    data.value.carts = data.value.carts.filter((cart) => cart.id !== id)
    showToast(ToastEnum.Success, t('message.success.removeCartSuccess'))
  } catch (error) {
    console.error('Error removing item:', error)
    showToast(ToastEnum.Error, t('message.error.removeCartFail'))
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    cartStore.getCarts()
  }
})
</script>
