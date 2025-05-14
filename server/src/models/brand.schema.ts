import { z } from 'zod';

export const BrandBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  originCountry: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().optional(),
});

export const BrandListSchema = z.object({
  brands: z.array(BrandBaseSchema),
  total: z.number(),
});

export type BrandBaseType = z.infer<typeof BrandBaseSchema>;
export type BrandListType = z.infer<typeof BrandListSchema>;
