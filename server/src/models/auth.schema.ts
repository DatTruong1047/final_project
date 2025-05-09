import z from 'zod';

import { PasswordType, UserCore } from './user.schema';

export const RegisterUserRequestSchema = z.object({
  email: UserCore.email,
  password: PasswordType,
});

export const LoginRequestSchema = z.object({
  email: UserCore.email,
  password: PasswordType,
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const ForgotPasswordRequestSchema = z.object({
  email: UserCore.email,
});

export const ResetPasswordRequestSchema = z
  .object({
    resetToken: z.string({
      required_error: 'Reset token is required',
    }),
    password: PasswordType,
    confirmPassword: PasswordType,
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export const ChangePasswordRequestSchema = z
  .object({
    oldPassword: PasswordType,
    password: PasswordType,
    confirmPassword: PasswordType,
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  });

export type RegisterUserRequestType = z.infer<typeof RegisterUserRequestSchema>;
export type LoginRequestType = z.infer<typeof LoginRequestSchema>;
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;

export type ForgotPasswordRequestType = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequestSchema>;
export type ChangePasswordRequestType = z.infer<typeof ChangePasswordRequestSchema>;
