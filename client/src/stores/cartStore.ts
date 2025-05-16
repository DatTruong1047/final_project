import { addToCart, getCarts, removeFromCart, updateCart } from '@/api/cart'
import type { CartListType, CartUpdateRequestType, CartUpsertRequestType } from '@/types/cartType'
import { defineStore } from 'pinia'

interface State {
  cart: CartListType
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
    loading: { cart: false },
  }),

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
      } catch (error: any) {
        console.error('Error removing from cart:', error.message)
        return Promise.reject(error)
      } finally {
        this.loading.cart = false
      }
    },
  },
})
