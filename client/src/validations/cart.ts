import * as yup from 'yup'
import { i18n } from '../main'

import { ProductBaseSchema } from './product'

const t = i18n.global.t

export const CartBaseSchema = yup.object({
  id: yup.string().required(),
  productId: yup.string().required(),
  quantity: yup.number().required(),
  userId: yup.string().required(),
  product: ProductBaseSchema.omit([
    'attributes',
    'shortDescription',
    'longDescription',
    'productMedias',
  ])
    .shape({
      thumbnail: yup.object({
        id: yup.string().required(),
        media: yup
          .object({
            id: yup.string().required(),
            url: yup.string().required(),
            description: yup.string().nullable(),
          })
          .nullable(),
      }),
    })
    .required(),
  totalPrice: yup.number().optional(),
})

export const CartListSchema = yup.object({
  carts: yup.array(CartBaseSchema).required(),
  total: yup.number().required(),
  totalPrice: yup.number().required(),
})

export const CartDetailSchema = CartBaseSchema.shape({
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  deletedAt: yup.date().nullable(),
})

export const CartUpsertRequestSchema = yup.object({
  productId: yup.string().required(t('message.validation.cart.productId.required')),
  quantity: yup
    .number()
    .required(t('message.validation.cart.quantity.required'))
    .typeError(t('message.validation.cart.quantity.type'))
    .integer(t('message.validation.cart.quantity.integer'))
    .positive(t('message.validation.cart.quantity.positive'))
    .min(1, t('message.validation.cart.quantity.min')),
})

export const CartUpdateRequestSchema = yup.object({
  id: yup.string().required(),
  count: yup
    .number()
    .required(t('message.validation.cart.count.required'))
    .typeError(t('message.validation.cart.count.type'))
    .integer(t('message.validation.cart.count.integer'))
    .positive(t('message.validation.cart.count.positive'))
    .min(1, t('message.validation.cart.count.min')),
})
