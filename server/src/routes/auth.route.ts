import { FastifyInstance } from 'fastify';

import {
  SuccessResWithoutDataSchema,
  SuccessResponseSchema,
  RegisterUserRequestSchema,
  ErrorResponseSchema,
  VerifyEmailTokenSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  ForgotPasswordRequestSchema,
  RefreshTokenRequestSchema,
  RefreshTokenResponeSchema,
  ResetPasswordRequestSchema,
} from '@model';

import AuthService from '@services/auth.service';
import MailService from '@services/mail.service';
import UserService from '@services/user.service';

import AuthController from '@controller/auth.controller';

async function authRoute(app: FastifyInstance): Promise<void> {
  const authController = new AuthController(new AuthService(), new UserService(), new MailService());

  app.post('/sign-up', {
    schema: {
      tags: ['Auth'],
      body: RegisterUserRequestSchema,
      response: {
        201: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
      },
    },
    handler: authController.register,
  });

  app.post('/sign-in', {
    schema: {
      tags: ['Auth'],
      body: LoginRequestSchema,
      response: {
        200: SuccessResponseSchema(LoginResponseSchema),
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    handler: authController.login,
  });

  app.post('/verify-email', {
    schema: {
      tags: ['Auth'],
      body: VerifyEmailTokenSchema,
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyEmailToken],
    handler: authController.verifyEmail,
  });

  app.post('/forgot-password', {
    schema: {
      tags: ['Auth'],
      body: ForgotPasswordRequestSchema,
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    handler: authController.forgotPassword,
  });

  app.post('/refresh-token', {
    schema: {
      tags: ['Auth'],
      body: RefreshTokenRequestSchema,
      response: {
        200: SuccessResponseSchema(RefreshTokenResponeSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyRefreshToken],
    handler: authController.refreshToken,
  });

  app.post('/reset-password', {
    schema: {
      tags: ['Auth'],
      body: ResetPasswordRequestSchema,
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        404: ErrorResponseSchema,
      },
    },
    handler: authController.resetPassword,
  });
}

export default authRoute;
