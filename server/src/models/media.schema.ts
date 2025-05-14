import { z } from 'zod';

export const MediaSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  url: z.string(),
  userId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateMediaSchema = MediaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const MediaResponseSchema = MediaSchema.extend({
  url: z.string(),
});

export type MediaType = z.infer<typeof MediaSchema>;
export type CreateMediaType = z.infer<typeof CreateMediaSchema>;
export type MediaResponseType = z.infer<typeof MediaResponseSchema>;
