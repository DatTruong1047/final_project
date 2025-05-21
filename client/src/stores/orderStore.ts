import { createOrder } from '@/api/order'
import type { CreateOrderType, OrderBaseType } from '@/types/orderType'
import { defineStore } from 'pinia'

interface State {
  order: OrderBaseType | null
  isLoading: boolean
  note: string | null
}

export const useOrderStore = defineStore('order', {
  state: (): State => ({
    order: null,
    isLoading: false,
    note: '',
  }),
  actions: {
    async createOrder(req: CreateOrderType) {
      try {
        this.isLoading = true
        console.log('Create order request', req)
        const res = await createOrder(req)
        this.order = res.data
        console.log('Create order success', res.data)
        return res.data
      } catch (error) {
        console.error('Create order error', error)
        this.order = null
        return Promise.reject(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
