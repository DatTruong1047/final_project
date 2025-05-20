import { z } from "zod";

export const ChatQuerySchema = z.object({
  query: z.string().min(1),
});

export const ChatResponseSchema = z.object({
  query: z.string().min(1),
  response: z.array(z.object({
    metadata: z.object({
      name: z.string(),
      slug: z.string(),
      sku: z.string(),
      image: z.array(z.string()).nullish(),
      short_description: z.string().nullish(),
      price: z.number().nullish(),
      category_name: z.string().nullish(),
      brand_name: z.string().nullish(),
      attributes: z.record(z.string()).nullish(),
      summary: z.string().nullish(),
    }),
  })),
});

export type ChatQueryType = z.infer<typeof ChatQuerySchema>;
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;

