import { createOrder, getOrders } from '@/api/order'
import type { CreateOrderType, OrderBaseType, OrderFilterType, OrderStatus } from '@/types/orderType'
import { defineStore } from 'pinia'

interface State {
  order: OrderBaseType | null
  orders: OrderBaseType[]
  isLoading: boolean
  note: string | null
  page: number
  limit: number
  totalOrders: number
  totalPages: number
  currentPage: number
  status: OrderStatus | ''
  error: boolean
}

export const useOrderStore = defineStore('order', {
  state: (): State => ({
    order: null,
    orders: [],
    isLoading: false,
    note: '',
    page: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
    currentPage: 1,
    status: '',
    error: false,
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

    async getOrders(filter: OrderFilterType) {
      try {
        this.isLoading = true
        const res = await getOrders(filter)
        this.orders = res.data.orders
        this.page = res.data.page
        this.limit = res.data.limit
        this.totalOrders = res.data.totalOrders
        this.totalPages = res.data.totalPages

      } catch (error) {
        console.error('Get orders error', error)
        this.orders = []
        this.error = true
        return Promise.reject(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
