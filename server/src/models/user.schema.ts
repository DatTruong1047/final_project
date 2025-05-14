import z from 'zod';

export const PasswordType = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Password must be at most 16 characters long' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\[\]]).*$/, {
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character',
  });

export const UserCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
};

export const UserQuerySchema = z.object({
  searchText: z.string().optional(),
  take: z.number().int().default(5),
  skip: z.number().int().default(0),
});

export const UpdateProfileSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
      invalid_type_error: 'Full name must be a string',
    })
    .min(3, { message: 'Full name must be at least 3 characters' })
    .max(50, { message: 'Full name must be at most 50 characters' })
    .nullish(),

  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string',
    })
    .min(9, { message: 'Phone number must be at least 9 digits' })
    .max(11, { message: 'Phone number must be at most 11 digits' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' })
    .nullish(),

  address: z.string().nullish(),
});

export const ProfileResponseSchema = z.object({
  email: z.string().email().nullish(),
  fullName: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  address: z.string().nullish(),
  media: z
    .object({
      url: z.string().nullish(),
    })
    .nullish(),
});

export type UserQueryType = z.infer<typeof UserQuerySchema>;
export type UpdateProfileRequestType = z.infer<typeof UpdateProfileSchema>;
export type ProfileResponseType = z.infer<typeof ProfileResponseSchema>;
