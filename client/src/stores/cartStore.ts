import { addToCart, getCarts, removeFromCart, updateCart } from '@/api/cart'
import type {
  CartBaseType,
  CartListType,
  CartUpdateRequestType,
  CartUpsertRequestType,
} from '@/types/cartType'
import { defineStore } from 'pinia'

interface State {
  cart: CartListType
  selectedCartIds: string[]
  cartTotal: number
  loading: {
    cart: boolean
  }
}

export const useCartStore = defineStore('cart', {
  state: (): State => ({
    cart: {
      carts: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart') || '{}').carts
        : [],
      total: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart') || '{}').total
        : 0,
      totalPrice: localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart') || '{}').totalPrice
        : 0,
    },
    selectedCartIds: [],
    loading: { cart: false },
    cartTotal: localStorage.getItem('cartTotal')
      ? JSON.parse(localStorage.getItem('cartTotal') || '{}')
      : 0,
  }),

  getters: {
    getSelectedCartItems(state: State): CartListType['carts'] {
      return state.cart.carts.filter((item) => state.selectedCartIds.includes(item.id))
    },

    getCartTotalPrice(state: State): number {
      return state.cart.carts.reduce((total, item) => {
        if (state.selectedCartIds.includes(item.id)) {
          return total + item.quantity * item.product.price
        }
        return total
      }, 0)
    },
  },
  actions: {
    async getCarts() {
      try {
        this.loading.cart = true
        const response = await getCarts()
        localStorage.setItem('cart', JSON.stringify(response.data))

        this.cart = response.data
        this.cartTotal = this.cart.carts.reduce((total, item) => {
          return total + item.quantity
        }, 0)
        localStorage.setItem('cartTotal', JSON.stringify(this.cartTotal))
      } catch (error: any) {
        console.error('Error getting cart:', error.message)
        return Promise.reject(error)
      } finally {
        this.loading.cart = false
      }
    },

    async addToCart(data: CartUpsertRequestType) {
      try {
        this.loading.cart = true
        await addToCart(data)

        await this.getCarts()
      } catch (error: any) {
        console.error('Error adding to cart:', error.message)
        return Promise.reject(error)
      } finally {
        this.loading.cart = false
      }
    },

    async updateCart(data: CartUpdateRequestType) {
      try {
        this.loading.cart = true

        await updateCart(data)

        await this.getCarts()
      } catch (error: any) {
        console.error('Error updating cart:', error.message)
        return Promise.reject(error)
      } finally {
        this.loading.cart = false
      }
    },

    async removeFromCart(id: string) {
      try {
        this.loading.cart = true
        await removeFromCart(id)

        await this.getCarts()

        this.selectedCartIds = this.selectedCartIds.filter((item) => item !== id)
      } catch (error: any) {
        console.error('Error removing from cart:', error.message)
        return Promise.reject(error)
      } finally {
        this.loading.cart = false
      }
    },

    toggleSelectedCart(id: string, checked: boolean) {
      if (checked) {
        if (!this.selectedCartIds.includes(id)) {
          this.selectedCartIds.push(id)
        }
      } else {
        this.selectedCartIds = this.selectedCartIds.filter((item) => item !== id)
      }
    },

    clearCart() {
      localStorage.removeItem('cart')
      localStorage.removeItem('cartTotal')
      this.cart = { carts: [], total: 0, totalPrice: 0 }
      this.cartTotal = 0
      this.selectedCartIds = []
    },
  },
})
