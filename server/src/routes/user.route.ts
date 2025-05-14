import { FastifyInstance } from 'fastify';

import {
  SuccessResWithoutDataSchema,
  SuccessResponseSchema,
  ProfileResponseSchema,
  ErrorResponseSchema,
  ChangePasswordRequestSchema,
  UpdateProfileSchema,
} from '@model';

import UserController from '@app/controllers/user.controller';
import { MediaResponseSchema } from '@app/models/media.schema';

import UserService from '@services/user.service';

import { uploadFile } from '../validations/file.validation';

async function authRoute(app: FastifyInstance): Promise<void> {
  const userController = new UserController(new UserService());

  app.get('/profile', {
    schema: {
      tags: ['User'],
      response: {
        200: SuccessResponseSchema(ProfileResponseSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        403: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: userController.showProfile,
  });

  app.put('/avatar', {
    schema: {
      tags: ['User'],
      response: {
        200: SuccessResponseSchema(MediaResponseSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        403: ErrorResponseSchema,
        404: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    onRequest: [app.verifyToken],
    preValidation: [uploadFile],
    handler: userController.updateUserAvatar,
  });

  app.put('/change-password', {
    schema: {
      tags: ['User'],
      body: ChangePasswordRequestSchema,
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        403: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: userController.changePassword,
  });

  app.put('/profile', {
    schema: {
      tags: ['User'],
      body: UpdateProfileSchema,
      response: {
        200: SuccessResponseSchema(ProfileResponseSchema),
        400: ErrorResponseSchema,
        401: ErrorResponseSchema,
        403: ErrorResponseSchema,
      },
    },
    preHandler: [app.verifyToken],
    handler: userController.editProfile,
  });
}

export default authRoute;
