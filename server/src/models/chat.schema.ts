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
  createdAt: z.string(),
});

export const ChatMessageResponseSchema = z.object({
  chatMessages: z.array(ChatMessageSchema),
});

// export type CreateOrderWithChatType = z.infer<typeof CreateOrderWithChatSchema>;

export type ChatQueryType = z.infer<typeof ChatQuerySchema>;
export type ChatMessageType = z.infer<typeof ChatMessageSchema>;
export type ChatMessageResponseType = z.infer<typeof ChatMessageResponseSchema>;

export type CreateChatSessionType = z.infer<typeof CreateChatSessionSchema>;
export type ChatSessionResponseType = z.infer<typeof ChatSessionResponseSchema>;
export type MergeChatSessionType = z.infer<typeof MergeChatSessionSchema>;
