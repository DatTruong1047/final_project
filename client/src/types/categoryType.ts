import type { CategoryBaseSchema, CategoryListSchema } from '@/validations/category'
import yup from 'yup'

export type CategoryBaseType = yup.InferType<typeof CategoryBaseSchema>
export type CategoryListType = yup.InferType<typeof CategoryListSchema>
