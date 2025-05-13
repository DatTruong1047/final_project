import { getProductDetail, getProducts } from '@/api/product'
import type { ProductDetailType, ProductFilterType, ProductListType } from '@/types/productType'
import { defineStore } from 'pinia'

interface State {
  products: ProductListType['products']
  total: number
  page: number
  limit: number
  productDetail: ProductDetailType | undefined
}

export const useProductStore = defineStore('product', {
  state: (): State => ({
    products: [],
    total: 0,
    page: 1,
    limit: 8,
    productDetail: undefined,
  }),

  actions: {
    async getProducts(filter: ProductFilterType) {
      const response = await getProducts(filter)

      this.products = response.data.products
      this.total = response.data.total
      this.page = response.data.page
      this.limit = response.data.limit
    },

    async getProductDetail(id: string) {
      const response = await getProductDetail(id)
      this.productDetail = response.data
    },
  },
})
