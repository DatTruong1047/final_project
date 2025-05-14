import { getProductDetail, getProducts } from '@/api/product'
import type { ProductDetailType, ProductFilterType, ProductListType } from '@/types/productType'
import { defineStore } from 'pinia'

interface State {
  products: ProductListType['products']
  total: number
  page: number
  limit: number
  productDetail: ProductDetailType | null
  loading: {
    products: boolean
    productDetail: boolean
  }
}

export const useProductStore = defineStore('product', {
  state: (): State => ({
    products: [],
    total: 0,
    page: 1,
    limit: 8,
    productDetail: null,
    loading: {
      products: false,
      productDetail: false,
    },
  }),

  actions: {
    async getProducts(filter: ProductFilterType) {
      try {
        this.loading.products = true
        const response = await getProducts(filter)

        this.products = response.data.products
        this.total = response.data.total
        this.page = response.data.page
        this.limit = response.data.limit

        return response.data
      } catch (error) {
        console.error('Error getting products:', error)
        throw error
      } finally {
        this.loading.products = false
      }
    },

    async getProductDetail(id: string) {
      if (this.productDetail?.id === id && !this.loading.productDetail) {
        return this.productDetail
      }

      try {
        this.loading.productDetail = true
        this.productDetail = null

        const response = await getProductDetail(id)
        this.productDetail = response.data

        return response.data
      } catch (error) {
        console.error('Error getting product detail:', error)
        throw error
      } finally {
        this.loading.productDetail = false
      }
    },

    resetProductDetail() {
      this.productDetail = null
    },

    resetProducts() {
      this.products = []
      this.total = 0
    },
  },
})
