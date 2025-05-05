import { z } from 'zod';

export const ReqParamsSchema = z.object({
  id: z.string(),
});

export type ReqParamsType = z.infer<typeof ReqParamsSchema>;
