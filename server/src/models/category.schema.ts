import z from 'zod';

export const CategoryBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const CategoryListSchema = z.object({
  categories: z.array(CategoryBaseSchema),
  total: z.number(),
});

export type CategoryBaseType = z.infer<typeof CategoryBaseSchema>;
export type CategoryListType = z.infer<typeof CategoryListSchema>;
