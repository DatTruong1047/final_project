import * as Yup from 'yup'

export const ChatQuerySchema = Yup.object().shape({
  content: Yup.string().required('Message is required'),
  sessionId: Yup.string().required('Session ID is required'),
})

export const ProductSearchResponseSchema = Yup.object().shape({
  products: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        image: Yup.string().required(),
        brand: Yup.string().required(),
      }),
    )
    .required(),
  message: Yup.string().required(),
})

export const ProductSearchErrorResponseSchema = Yup.object().shape({
  products: Yup.array().max(0).required(),
  message: Yup.string().required(),
})

export const ProductComparisonResponseSchema = Yup.object().shape({
  product_names: Yup.array().of(Yup.string()).required(),
  attributes: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        values: Yup.array().of(Yup.string()).required(),
      }),
    )
    .required(),
  message: Yup.string().required(),
})

export const CreateOrderSuccessResponseSchema = Yup.object().shape({
  status: Yup.string().oneOf(['success']).required(),
  message: Yup.string().required(),
  client_serect: Yup.string().required(),
})

export const CreateOrderErrorResponseSchema = Yup.object().shape({
  status: Yup.string().oneOf(['error']).required(),
  message: Yup.string().required(),
  client_serect: Yup.string().oneOf(['']).required(),
})

export const GeneralMessageResponseSchema = Yup.object().shape({
  message: Yup.string().required(),
})

export const GeminiResponseDataSchema = Yup.mixed().oneOf([
  ProductSearchResponseSchema,
  ProductSearchErrorResponseSchema,
  ProductComparisonResponseSchema,
  CreateOrderSuccessResponseSchema,
  CreateOrderErrorResponseSchema,
  GeneralMessageResponseSchema,
])

export const ChatAIMessageResponseSchema = Yup.object().shape({
  chatMessages: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        content: Yup.string().required(),
        sessionId: Yup.string().required(),
        createdAt: Yup.string().required(),
        role: Yup.string().required(),
      }),
    )
    .required(),
  tool: Yup.string().required(),
  content: GeminiResponseDataSchema.required(),
})

export const ChatSessionResponseSchema = Yup.object().shape({
  id: Yup.string().required('Session ID is required'),
  userId: Yup.string().required('User ID is required'),
  isActive: Yup.boolean().required('Is Active is required'),
  createdAt: Yup.string().required('Created At is required'),
  endAt: Yup.string().required('End At is required'),
  anonymousId: Yup.string().required('Anonymous ID is required'),
})

export const CreateSessionSchema = Yup.object().shape({
  userId: Yup.string().nullable(),
})

export const MergeChatSessionSchema = Yup.object().shape({
  userId: Yup.string().required('User ID is required'),
  anonymousId: Yup.string().required('Anonymous ID is required'),
})

export const ChatMessageSchema = Yup.object().shape({
  id: Yup.string().required('Message ID is required'),
  content: Yup.string().required('Message is required'),
  tool: Yup.string().required('Tool is required'),
  sessionId: Yup.string().required('Session ID is required'),
  createdAt: Yup.string().required('Created At is required'),
  role: Yup.string().required('Role is required'),
})

export const ChatMessagesResponseSchema = Yup.object().shape({
  messages: Yup.array().of(ChatMessageSchema).required('Messages are required'),
})
