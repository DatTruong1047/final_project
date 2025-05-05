import z from 'zod'

export const PasswordType = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Password must be at most 16 characters long' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\[\]]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
  })

export const UserCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
}
