import z from 'zod';

export const TokenOptionSchema = z.object({
  expiresIn: z.string(),
});

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  userEmail: z.string(),
  isAdmin: z.boolean(),
});

export const EmailTokenPayloadSchema = z.object({
  userId: z.string(),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string(),
  userId: z.string(),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const RefreshTokenResponeSchema = z.object({
  refreshToken: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string(),
  userId: z.string(),
  users: z.object({
    isAdmin: z.boolean(),
    email: z.string(),
  }),
});

export const VerifyTokenResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export type TokenOption = z.infer<typeof TokenOptionSchema>;
export type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;
export type EmailTokenPayloadType = z.infer<typeof EmailTokenPayloadSchema>;
export type RefreshTokenType = z.infer<typeof RefreshTokenSchema>;
export type RefreshTokenRequestType = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponeType = z.infer<typeof RefreshTokenResponeSchema>;
export type VerifyTokenResponse = z.infer<typeof VerifyTokenResponseSchema>;
