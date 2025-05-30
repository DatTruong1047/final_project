import * as Yup from 'yup'

// Response schemas
export const ProductSearchResponseSchema = Yup.object().shape({
  products: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        image: Yup.string().required(),
        brand: Yup.string().required(),
      }),
    )
    .default([]),
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
  product_names: Yup.array().of(Yup.string()).default([]),
  attributes: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        values: Yup.array().of(Yup.string()).default([]),
      }),
    )
    .default([]),
})

// Type definitions
export type ProductSearchResponse = Yup.InferType<typeof ProductSearchResponseSchema>
export type ProductSearchErrorResponse = Yup.InferType<typeof ProductSearchErrorResponseSchema>
export type ProductComparisonResponse = Yup.InferType<typeof ProductComparisonResponseSchema>
export type CreateOrderSuccessResponse = Yup.InferType<typeof CreateOrderSuccessResponseSchema>
export type CreateOrderErrorResponse = Yup.InferType<typeof CreateOrderErrorResponseSchema>
export type GeneralMessageResponse = Yup.InferType<typeof GeneralMessageResponseSchema>

export type ToolResponse =
  | ProductSearchResponse
  | ProductSearchErrorResponse
  | ProductComparisonResponse
  | CreateOrderSuccessResponse
  | CreateOrderErrorResponse
  | GeneralMessageResponse

// Utility functions
export const extractJSON = (text: string): any => {
  try {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    const jsonText = match ? match[1].trim() : text.trim()
    return JSON.parse(jsonText)
  } catch (error) {
    return text
  }
}

export const parseResponse = (
  output: string,
  tool: string,
): { aiMessage: string; toolName: string; response: ToolResponse } => {
  const jsonResult = extractJSON(output)
  let aiMessage = output
  let toolName = tool
  let response: ToolResponse | string = ''

  switch (tool) {
    case 'product_search':
      response = ProductSearchResponseSchema.isValidSync(jsonResult)
        ? ProductSearchResponseSchema.cast(jsonResult)
        : ProductSearchErrorResponseSchema.cast(jsonResult)
      break

    case 'product_comparison':
      response = ProductComparisonResponseSchema.cast(jsonResult)
      break

    case 'create_order':
      response = CreateOrderSuccessResponseSchema.isValidSync(jsonResult)
        ? CreateOrderSuccessResponseSchema.cast(jsonResult)
        : CreateOrderErrorResponseSchema.cast(jsonResult)
      break

    case 'general_message':
      response = aiMessage
      break

    default:
      aiMessage = jsonResult
      response = ''
      break
  }

  return { aiMessage, toolName, response: response as ToolResponse }
}
