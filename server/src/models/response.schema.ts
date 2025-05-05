import z from 'zod';

const ResponseCore = {
  code: z.number(),
};

export const ErrorResponseSchema = z.object({
  message: z.string().nullish().optional(),
  ...ResponseCore,
});

export const SuccessResWithoutDataSchema = z.object({
  ...ResponseCore,
  status: z.string().nullish(),
  success: z.boolean().nullish(),
});

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T | z.ZodArray<T>) => {
  return z.object({
    ...ResponseCore,
    status: z.string().optional().nullish(),
    data: dataSchema,
  });
};

export type ResultType<T> = {
  code?: number;
  message?: string;
  success: boolean;
  data?: T;
};

export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponseType<T> = z.infer<ReturnType<typeof SuccessResponseSchema<z.ZodType<T>>>>;
export type SuccessResWithoutDataType = z.infer<typeof SuccessResWithoutDataSchema>;
