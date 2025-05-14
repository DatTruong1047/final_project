import * as yup from 'yup'

export const CategoryBaseSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
})

export const CategoryListSchema = yup.object({
  categories: yup.array().of(CategoryBaseSchema).required(),
  total: yup.number().required(),
})
