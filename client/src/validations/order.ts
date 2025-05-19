import yup from 'yup'

export const createOrderSchema = yup.object().shape({
  cartIds: yup.array().of(yup.string()).required('Cart ID is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  note: yup.string().optional().nullable(),
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
  orderDate: yup.date().typeError('Ngày đặt không hợp lệ').required(),
  orderStatus: yup.mixed().oneOf(['CREATED', 'PROCESSING', 'COMPLETED', 'CANCELLED']).required(),
  orderDetails: yup.array().of(orderDetailSchema).min(1).required(),
  paymentIntent: paymentIntentSchema.nullable(),
})
