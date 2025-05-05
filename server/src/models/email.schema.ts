import z from 'zod';

export const VerifyEmailTokenSchema = z.object({
  token: z.string(),
});

export type VerifyEmailTokenType = z.infer<typeof VerifyEmailTokenSchema>;
