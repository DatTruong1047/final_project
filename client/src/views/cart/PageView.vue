<template>
  <div
    class="flex h-[100vh] justify-center items-center"
    v-if="cartStore.loading.cart || orderStore.isLoading"
  >
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
            :on-select-item="onSelectItem"
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

        <!-- Cart Summary -->
        <CartSummaryComponent v-if="data.carts && data.carts.length > 0" />
      </div>
    </template>
  </div>

  <ConfirmModal
    ref="confirmModal"
    @confirm="confirmDelete"
    :title="`Delete product '${productToDeleteName}' from cart?`"
    :message="`Are you sure you want to delete product '${productToDeleteName}' from cart?`"
    confirmText="Delete"
    cancelText="Cancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/hooks/useToast'

import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { cartRoute } from '@/configs'

import ConfirmModal from '@/components/atoms/_utils/ConfirmModal.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import BreadcrumbComponent from '@/components/_utils/BreadcrumbComponent.vue'
import CartEmptyComponent from '@/components/cart/CartEmptyComponent.vue'
import CartListComponent from '@/components/cart/CartListComponent.vue'
import CartSummaryComponent from '@/components/cart/CartSummaryComponent.vue'
import UnAuthenComponent from '@/components/_utils/UnAuthenComponent.vue'

import { ToastEnum } from '@/types/enum'

const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const { showToast } = useToast()
const { t } = useI18n()

const breadcrumbs = computed(() => [{ label: 'Cart', to: cartRoute.cart }])
const confirmModal = ref<any>(null)
const productToDelete = ref<string | null>(null)
const productToDeleteName = ref<string>('')

const data = computed(() => cartStore.cart)
const selectedCartItems = computed(() => cartStore.getSelectedCartItems)

console.log(selectedCartItems.value)

const onIncreaseQuantity = async (id: string) => {
  try {
    const cart = data.value.carts?.find((cart) => cart.id === id)

    if (cart) {
      await cartStore.updateCart({ id: cart.id, count: cart.quantity + 1 })
    }
  } catch (error) {
    console.error('Error increasing quantity:', error)
    showToast(ToastEnum.Error, t('message.error.updateCartFail'))
  }
}

const onDecreaseQuantity = async (id: string) => {
  try {
    const cart = data.value.carts?.find((cart) => cart.id === id)
    if (cart) {
      if (cart.quantity > 1) {
        await cartStore.updateCart({ id: cart.id, count: cart.quantity - 1 })
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
  const cart = data.value.carts?.find((item) => item.id === id)
  if (cart) {
    productToDelete.value = id
    productToDeleteName.value = cart.product.name
    confirmModal.value?.openModal()
  }
}

const onSelectItem = (id: string, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  cartStore.toggleSelectedCart(id, checked)
}

const confirmDelete = async () => {
  try {
    const id = productToDelete.value
    if (id) {
      await cartStore.removeFromCart(id)

      data.value.carts = data.value.carts?.filter((cart) => cart.id !== id)

      showToast(ToastEnum.Success, t('message.success.removeCartSuccess'))
    }
  } catch (error) {
    console.error('Error removing item:', error)
    showToast(ToastEnum.Error, t('message.error.removeCartFail'))
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await cartStore.getCarts()
  }
})
</script>
