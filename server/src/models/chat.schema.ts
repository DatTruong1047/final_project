import { z } from 'zod';

import { RoleEnum } from 'generated/prisma';
import { ProductMetadataSchema } from './product.schema';

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

export const GetMessagesQuerySchema = z.object({
  skip: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 0 : num;
    }, z.number().min(0).default(0))
    .optional(),
  take: z
    .preprocess((val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) ? 8 : num;
    }, z.number().min(1).default(8))
    .optional(),
  orderBy: z.enum(['asc', 'desc']).optional(),
});

export const ProductSearchOutputSchema = z.object({
  answer: z.string().describe("Answer to the user's question"),
  product_list: z.array(
    z.object({
      sku: z.string().describe('SKU of the product'),
      name: z.string().describe('Name of the product'),
      price: z.number().describe('Price of the product'),
      image: z.string().describe('Image url of the product'),
    })
  ),
});

export const ProductComparisonOutputSchema = z.object({
  answer: z.string().describe("Answer to the user's question"),
  comparison_result: z.object({
    productNames: z.array(z.string()).describe('The names of the products to compare'),
    attributes: z.array(
      z.object({
        name: z.string().describe('The key of the attribute'),
        values: z.array(z.string()).describe('The values of the attribute'),
      })
    ),
  }),
});

export const CreateOrderOutputSchema = z.object({
  answer: z.string().describe("Answer to the user's question"),
  orderResult: z.object({
    paymentIntent: z
      .object({
        clientSecret: z.string().optional().describe('The client secret of the order'),
        id: z.string().optional().describe('The id of the order'),
      })
      .optional(),
    success: z.boolean().describe('Whether the order is successful').default(false),
  }),
});

export const CreateOrderExtractionSchema = z.object({
  address: z.string().optional().describe('Địa chỉ giao hàng đầy đủ'),
  fullname: z.string().optional().describe('Tên đầy đủ của khách hàng'),
  phoneNumber: z.string().optional().describe('Số điện thoại liên hệ'),
  productName: z.string().optional().describe('Tên sản phẩm cần đặt'),
  count: z.number().optional().describe('Số lượng sản phẩm muốn đặt'),
  note: z.string().optional().describe('Ghi chú thêm cho đơn hàng'),
  user_response: z
    .string()
    .describe(
      'Câu trả lời cho người dùng. Nếu thiếu thông tin, hãy hỏi. Nếu đủ, hãy xác nhận thông tin đã thu thập được và sẵn sàng tạo đơn.'
    ),
});

export const CommunicateOutputSchema = z.object({
  answer: z.string().describe('The response to the user'),
});

export const AgentResultSchema = z.object({
  content: z.string(),
  error_detail: z.string().optional(),
  tool: z.string().optional(),
});

// export const GeminiResponseData = z.object({
//   code: z.number(),
//   success: z.boolean(),
//   message: z.string(),
//   data: AgentResultSchema,
// });

export const ChatMessageResponseSchema = z.object({
  chatMessages: z.array(ChatMessageSchema),
  total: z.number(),
  hasMore: z.boolean(),
});

// export type CreateOrderWithChatType = z.infer<typeof CreateOrderWithChatSchema>;

export type ChatQueryType = z.infer<typeof ChatQuerySchema>;
export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type ChatMessageResponseType = z.infer<typeof ChatMessageResponseSchema>;

export type CreateChatSessionType = z.infer<typeof CreateChatSessionSchema>;
export type ChatSessionResponseType = z.infer<typeof ChatSessionResponseSchema>;
export type MergeChatSessionType = z.infer<typeof MergeChatSessionSchema>;
export type GetMessagesQueryType = z.infer<typeof GetMessagesQuerySchema>;

export type CreateOrderExtractionType = z.infer<typeof CreateOrderExtractionSchema>;
export type CreateOrderOutputType = z.infer<typeof CreateOrderOutputSchema>;
export type ProductSearchOutputType = z.infer<typeof ProductSearchOutputSchema>;
export type ProductComparisonOutputType = z.infer<typeof ProductComparisonOutputSchema>;
export type CommunicateOutputType = z.infer<typeof CommunicateOutputSchema>;

// export type GeminiResponseDataType = z.infer<typeof GeminiResponseData>;
export type AgentResultType = z.infer<typeof AgentResultSchema>;
