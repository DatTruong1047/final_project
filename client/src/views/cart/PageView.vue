<template>
  <div class="mx-auto px-4 py-8 h-full bg-gray-50">
    <nav class="flex mb-8 text-sm" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center text-2xl font-medium">
          <router-link to="/" class="text-red-500 hover:text-red-700 hover:underline rounded-md">
            Home
          </router-link>
        </li>
        <li>
          <router-link
            to="/cart"
            class="text-red-500 hover:text-red-700 text-2xl font-medium hover:underline rounded-md"
          >
            <span class="mx-1 text-red-300">/</span>
            Cart
          </router-link>
        </li>
      </ol>
    </nav>

    <div class="lg:grid lg:grid-cols-3 lg:gap-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <!-- Table header -->
          <div class="hidden md:grid md:grid-cols-4 text-left p-4 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Product</h2>
            <h2 class="text-xl font-bold text-gray-900 ml-2">Price</h2>
            <h2 class="text-xl font-bold text-gray-900 ml-2">Quantity</h2>
            <h2 class="text-xl font-bold text-gray-900 ml-2">Total</h2>
          </div>

          <!-- Cart Items -->
          <div
            v-for="(cart, index) in data.carts"
            :key="cart.id"
            class="border-b border-gray-200 last:border-b-0"
          >
            <div class="grid grid-cols-1 sm:grid-cols-4 p-4 gap-4 items-center">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="absolute -top-3 -left-3 flex items-center justify-center">
                    <button
                      class="text-white hover:bg-red-500 rounded-full bg-red-600 p-1"
                      @click="removeItem(index)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <img
                    :src="cart.product.thumbnail.media.url"
                    :alt="cart.product.name"
                    class="w-36 h-28 rounded-md"
                  />
                </div>
                <div class="flex flex-col gap-1 ml-2">
                  <h3 class="text-lg font-medium text-gray-900">{{ cart.product.name }}</h3>
                  <p class="text-sm text-gray-500">SKU: {{ cart.product.code }}</p>
                </div>
              </div>

              <div class="md:text-left text-xl">
                <span class="md:hidden font-medium text-gray-700">Price: </span>
                <span class="text-red-500 font-bold">{{ vndFormat(cart.product.price) }}</span>
              </div>

              <div class="md:text-left text-2xl flex items-center gap-2">
                <button
                  class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                  @click="decreaseQuantity(index)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span class="w-12 text-center">{{ cart.quantity }}</span>

                <button
                  class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                  @click="increaseQuantity(index)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <div class="md:text-left text-xl">
                <span class="md:hidden font-medium text-gray-700">Total: </span>
                <span class="text-red-500 font-bold">{{
                  vndFormat(cart.product.price * cart.quantity)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between mb-8">
          <RouterLink
            to="/"
            class="py-2.5 px-5 text-xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-200"
          >
            Return To Shop
          </RouterLink>
          <button
            type="button"
            class="py-2.5 px-5 text-xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-200"
            :disabled="changedList.length < 1"
            :class="{ 'opacity-50 cursor-not-allowed': changedList.length < 1 }"
            @click="onUpdateCart"
          >
            Update Cart
          </button>
        </div>
      </div>

      <!-- Cart Summary  -->
      <div class="lg:col-span-1 text-2xl">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
          <h2 class="font-bold text-gray-800 mb-4 uppercase">Cart Total</h2>

          <div class="border-b border-gray-200 py-3 flex justify-between">
            <span class="font-medium text-gray-700 uppercase">Subtotal:</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>

          <div class="border-b border-gray-200 py-3 flex justify-between">
            <span class="font-medium text-gray-700 uppercase">Shipping:</span>
            <span>Free</span>
          </div>

          <div class="border-b border-gray-200 py-3 flex justify-between mb-8">
            <span class="font-medium text-gray-700 uppercase">Total:</span>
            <span class="font-medium">${{ cartTotal.toFixed(2) }}</span>
          </div>

          <RouterLink
            to="/checkout"
            class="w-full text-xl text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-bold rounded-lg px-5 py-3 focus:outline-none"
          >
            Proceed to checkout
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { vndFormat } from '@/helpers/processPrice'
import { useCartStore } from '@/stores/cartStore'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()
const route = useRoute()

onMounted(() => {
  cartStore.getCarts()
  console.log(authStore.accessToken)
})

const data = ref({
  carts: [
    {
      id: '72ef9657-ba1d-46a7-900f-57b489086b12',
      productId: '0bd8452e-5b44-496a-a664-84482a7023ac',
      quantity: 5,
      userId: '63157961-44d8-400e-8f3e-33eb61eb28de',
      product: {
        id: '0bd8452e-5b44-496a-a664-84482a7023ac',
        name: 'Đèn Treo Trần Thủy Tinh ECODL9 Vàng',
        code: '560000835',
        price: 1790000,
        quantity: 100,
        categoryId: '33a1aae7-1840-4d23-a328-6c8aa0d26f2a',
        category: {
          id: '33a1aae7-1840-4d23-a328-6c8aa0d26f2a',
          name: 'Trang trí',
        },
        brandId: '48299b7f-ffdc-4d3e-bd61-7c6033beecca',
        brand: {
          id: '48299b7f-ffdc-4d3e-bd61-7c6033beecca',
          name: 'sony',
        },
        thumbnail: {
          id: 'b00b1404-4304-4cf1-816c-68dae9c99753',
          media: {
            id: 'b00b1404-4304-4cf1-816c-68dae9c99753',
            url: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_29183/den-treo-tran-t_main_446_1020.png.webp',
            description: 'Đèn Treo Trần Thủy Tinh ECODL9 Vàng',
          },
        },
      },
      totalPrice: 8950000,
    },
    {
      id: 'c68238ec-2338-483b-adc1-54653883f3d8',
      productId: 'e611458d-0765-4261-855e-a3f75f2b4a56',
      quantity: 4,
      userId: '63157961-44d8-400e-8f3e-33eb61eb28de',
      product: {
        id: 'e611458d-0765-4261-855e-a3f75f2b4a56',
        name: 'Đèn Treo Trần Thủy Tinh ECODL11',
        code: '560000839',
        price: 7499000,
        quantity: 98,
        categoryId: '33a1aae7-1840-4d23-a328-6c8aa0d26f2a',
        category: {
          id: '33a1aae7-1840-4d23-a328-6c8aa0d26f2a',
          name: 'Trang trí',
        },
        brandId: '48299b7f-ffdc-4d3e-bd61-7c6033beecca',
        brand: {
          id: '48299b7f-ffdc-4d3e-bd61-7c6033beecca',
          name: 'sony',
        },
        thumbnail: {
          id: '2188704c-a4be-4751-a17c-e44aa9df6a40',
          media: {
            id: '2188704c-a4be-4751-a17c-e44aa9df6a40',
            url: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture//Apro/Apro_product_29186/den-treo-tran-t_main_319_1020.png.webp',
            description: 'Đèn Treo Trần Thủy Tinh ECODL11',
          },
        },
      },
      totalPrice: 29996000,
    },
  ],
  total: 2,
  totalPrice: 389456000,
})

// Computed property for cart total
const cartTotal = computed(() => {
  return data.value.carts.reduce((total, item) => {
    return total + item.product.price * item.quantity
  }, 0)
})

const changedList = ref<{ id: string; quantity: number }[]>([])

const updateChangedList = (id: string, quantity: number) => {
  console.log(id, quantity)
  const index = data.value.carts.findIndex((cart) => cart.id === id)
  if (index !== -1) {
    changedList.value[index].quantity = quantity
  }
  changedList.value.push({ id, quantity })
}

const increaseQuantity = (index: number) => {
  const cart = data.value.carts[index]
  cart.quantity++
  updateChangedList(cart.id, cart.quantity)
}

const decreaseQuantity = (index: number) => {
  const cart = data.value.carts[index]
  if (cart.quantity > 1) {
    cart.quantity--
    updateChangedList(cart.id, cart.quantity)
  }
}

watch(changedList, (newVal) => {
  console.log(newVal.length)
})

const onUpdateCart = () => {
  console.log(changedList.value)
}

// Method to remove item
const removeItem = (index: number) => {
  data.value.carts.splice(index, 1)
}
</script>
