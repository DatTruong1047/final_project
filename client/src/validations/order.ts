import * as yup from 'yup'

export const CreateDeliveryInfoSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^(0|\+84)[0-9]{9}$/,
      'Phone number is not valid (must start with 0 or +84 and have 10 digits total)',
    ),
  note: yup.string().optional().nullable(),
  fullname: yup
    .string()
    .required('Full name is required')
    .typeError('Full name is required')
    .min(5, 'Full name must be at least 5 characters long')
    .max(50, 'Full name must be at most 50 characters long'),
  address: yup.string().required('Address is required').typeError('Address is required'),
})
export const createOrderSchema = yup.object().shape({
  cartIds: yup.array().of(yup.string()).required('Cart ID is required'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^(0|\+84)[0-9]{9}$/,
      'Phone number is not valid (must start with 0 or +84 and have 10 digits total)',
    ),
  note: yup.string().optional().nullable(),
  fullname: yup
    .string()
    .required('Full name is required')
    .typeError('Full name is required')
    .min(5, 'Full name must be at least 5 characters long')
    .max(50, 'Full name must be at most 50 characters long'),
  address: yup.string().required('Address is required').typeError('Address is required'),
})

export const orderDetailSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  productId: yup.string().uuid().required(),
  productName: yup.string().required(),
  quantity: yup.number().integer().min(1).required(),
  unitPrice: yup.number().min(0).required(),
  subTotal: yup.number().min(0).required(),
})

export const paymentIntentSchema = yup.object().shape({
  id: yup.string().required(),
  clientSecret: yup.string().required(),
})

export const orderSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  userId: yup.string().uuid().required(),
  phoneNumber: yup
    .string()
    .matches(/^0[0-9]{9,10}$/, 'Số điện thoại không hợp lệ')
    .required(),
  note: yup.string().nullable(),
  totalAmount: yup.string().matches(/^\d+$/, 'Tổng tiền phải là chuỗi chứa số').required(),
  orderDate: yup.string().typeError('Ngày đặt không hợp lệ').required(),
  orderStatus: yup.mixed().oneOf(['CREATED', 'COMPLETED', 'FAILED', 'REFUNDED']).required(),
  orderDetails: yup.array().of(orderDetailSchema).min(1).required(),
  paymentIntent: paymentIntentSchema.nullable(),
})

export const OrderFilterSchema = yup.object().shape({
  status: yup
    .mixed()
    .oneOf(['CREATED', 'COMPLETED', 'FAILED', 'REFUNDED'])
    .optional()
    .nullable(),
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).default(8),
})
