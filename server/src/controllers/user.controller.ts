import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorCodes } from '@config';
import {
  ChangePasswordRequestType,
  ErrorResponseType,
  FileType,
  ProfileResponseType,
  SuccessResponseType,
  SuccessResWithoutDataType,
  UpdateProfileRequestType,
} from '@model';

import { MediaResponseType } from '@app/models/media.schema';

import UserService from '@services/user.service';

import { binding } from '@decorators/binding.decorator';

export default class UserController {
  constructor(private readonly userService: UserService) {}

  @binding
  async showProfile(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;
      const user = await this.userService.getUserProfile(decodedAccessToken.userId);

      if (!user) {
        const errorResponse: ErrorResponseType = {
          code: ErrorCodes.USER_NOT_FOUND,
          message: 'User not found',
        };
        return reply.NotFound(errorResponse);
      }

      const res: SuccessResponseType<ProfileResponseType> = {
        code: 200,
        data: user,
      };

      return reply.OK(res);
    } catch (error) {
      const errorResponse: ErrorResponseType = {
        code: ErrorCodes.SERVER_ERROR,
        message: 'Internal server error',
      };
      return reply.InternalServer(errorResponse);
    }
  }

  @binding
  async editProfile(
    request: FastifyRequest<{ Body: UpdateProfileRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;
      const { fullName, phoneNumber, address } = request.body;

      const result = await this.userService.updateProfile(decodedAccessToken.userId, {
        fullName,
        phoneNumber,
        address,
      });

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        if (result.code === ErrorCodes.USER_NOT_FOUND) {
          return reply.NotFound(errorResponse);
        }
        return reply.BadRequest(errorResponse);
      }

      const res: SuccessResponseType<ProfileResponseType> = {
        code: 200,
        data: result.data,
      };

      return reply.OK(res);
    } catch (error) {
      const errorResponse: ErrorResponseType = {
        code: ErrorCodes.SERVER_ERROR,
        message: 'Internal server error',
      };
      return reply.InternalServer(errorResponse);
    }
  }

  @binding
  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;
      const { oldPassword, password } = request.body;

      const result = await this.userService.changePassword(decodedAccessToken.userId, {
        oldPassword,
        password,
      });

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        if (result.code === ErrorCodes.USER_NOT_FOUND) {
          return reply.NotFound(errorResponse);
        }
        return reply.BadRequest(errorResponse);
      }

      const res: SuccessResWithoutDataType = {
        code: 200,
      };

      return reply.OK(res);
    } catch (error) {
      const errorResponse: ErrorResponseType = {
        code: ErrorCodes.SERVER_ERROR,
        message: 'Internal server error',
      };
      return reply.InternalServer(errorResponse);
    }
  }

  @binding
  async updateUserAvatar(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const { decodedAccessToken } = request;
      const file: FileType = request.uploadedFile;

      const result = await this.userService.updateUserAvatar(decodedAccessToken.userId, file);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          code: result.code,
          message: result.message,
        };
        if (result.code === ErrorCodes.USER_NOT_FOUND) {
          return reply.NotFound(errorResponse);
        }
        return reply.BadRequest(errorResponse);
      }

      const res: SuccessResponseType<MediaResponseType> = {
        code: 200,
        data: result.data,
      };

      return reply.OK(res);
    } catch (error) {
      const errorResponse: ErrorResponseType = {
        code: ErrorCodes.SERVER_ERROR,
        message: 'Internal server error',
      };
      return reply.InternalServer(errorResponse);
    }
  }
}
