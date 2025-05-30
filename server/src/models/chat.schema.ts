import { z } from 'zod';

import { RoleEnum } from 'generated/prisma';

export const ChatQuerySchema = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(1),
  sessionId: z.string({
    required_error: 'Session ID is required',
    invalid_type_error: 'Session ID must be a string',
  }),
});

export const CreateChatSessionSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a string',
    })
    .nullish(),
});

export const ChatSessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string().nullish(),
  isActive: z.boolean(),
  createdAt: z.string(),
  endedAt: z.string().nullish(),
  anonymousId: z.string().nullish(),
});

// export const ChatResponseSchema = z.object({
//   query: z.string().min(1),
//   response: z.array(
//     z.object({
//       metadata: ProductMetadataSchema,
//     })
//   ),
// });

export const MergeChatSessionSchema = z.object({
  userId: z.string(),
  anonymousId: z.string(),
});

export const ChatMessageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  sessionId: z.string(),
  role: z.nativeEnum(RoleEnum),
  tool: z.string().nullish(),
  createdAt: z.string(),
});

// Schema cho ProductSearchTool (tìm kiếm sản phẩm)
export const ProductSearchResponseSchema = z.object({
  products: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      brand: z.string(),
      })
    )
    .default([])
    .nullish(),
  message: z.string(),
});

// Schema cho trường hợp ProductSearchTool bị lỗi
export const ProductSearchErrorResponseSchema = z.object({
  products: z.array(z.any()).max(0), // Đảm bảo mảng rỗng
  message: z.string(),
});

// Schema cho ProductComparisonTool (so sánh sản phẩm)
export const ProductComparisonResponseSchema = z.object({
  product_names: z.array(z.string()),
  attributes: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    })
  ),
  message: z.string(),
});

// Schema cho CreateOrderTool khi thành công
export const CreateOrderSuccessResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  client_serect: z.string(),
});

// Schema cho CreateOrderTool khi thất bại
export const CreateOrderErrorResponseSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
  client_serect: z.literal(''), // Đảm bảo là chuỗi rỗng
});

// Schema cho câu hỏi thông thường
export const GeneralMessageResponseSchema = z.object({
  message: z.string(),
});

export const GeminiResponseDataSchema = z.union([
  ProductSearchResponseSchema,
  ProductSearchErrorResponseSchema,
  ProductComparisonResponseSchema,
  CreateOrderSuccessResponseSchema,
  CreateOrderErrorResponseSchema,
  GeneralMessageResponseSchema,
]);

export const ChatMessageResponseSchema = z.object({
  chatMessages: z.array(ChatMessageSchema),
});

export type GeminiResponseData =
  | z.infer<typeof ProductSearchResponseSchema>
  | z.infer<typeof ProductSearchErrorResponseSchema>
  | z.infer<typeof ProductComparisonResponseSchema>
  | z.infer<typeof CreateOrderSuccessResponseSchema>
  | z.infer<typeof CreateOrderErrorResponseSchema>
  | z.infer<typeof GeneralMessageResponseSchema>;

// export type CreateOrderWithChatType = z.infer<typeof CreateOrderWithChatSchema>;

export type ChatQueryType = z.infer<typeof ChatQuerySchema>;
export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type ChatMessageResponseType = z.infer<typeof ChatMessageResponseSchema>;

export type CreateChatSessionType = z.infer<typeof CreateChatSessionSchema>;
export type ChatSessionResponseType = z.infer<typeof ChatSessionResponseSchema>;
export type MergeChatSessionType = z.infer<typeof MergeChatSessionSchema>;
