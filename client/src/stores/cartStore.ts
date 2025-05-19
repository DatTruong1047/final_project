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
  loading: {
    cart: boolean
  }
}

export const useCartStore = defineStore('cart', {
  state: (): State => ({
    cart: {
      carts: [],
      total: 0,
      totalPrice: 0,
    },
    selectedCartIds: [],
    loading: { cart: false },
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
        this.cart = response.data
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
        const response = await addToCart(data)

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
        const response = await removeFromCart(id)

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
  },
})
