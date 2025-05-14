import { getCategories } from '@/api/category'
import type { CategoryBaseType } from '@/types/categoryType'
import { defineStore } from 'pinia'

interface State {
  categories: CategoryBaseType[]
  selectedCategory: string | null
}

export const useCategoryStore = defineStore('category', {
  state: (): State => ({
    categories: [],
    selectedCategory: null,
  }),

  actions: {
    async getCategories() {
      try {
        const response = await getCategories()
        this.categories = response.data.categories
      } catch (error) {
        this.categories = []
        throw new Error('Failed to fetch categories')
      }
    },
    setSelectedCategory(categoryId: string) {
      this.selectedCategory = categoryId
    },
  },
})
