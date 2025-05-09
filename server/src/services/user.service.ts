import crypto from 'crypto';

import { User } from 'generated/prisma';

import { ErrorCodes, uploadFileConfig } from '@app/config';
import {
  ChangePasswordRequestType,
  FileType,
  ProfileResponseType,
  ResultType,
  UpdateProfileRequestType,
} from '@app/models';
import { MediaResponseType } from '@app/models/media.schema';
import MediaRepository from '@app/repositories/media.repository';
import UserRepository from '@app/repositories/user.repository';
import { VerifyEmailType } from '@app/types/fastify';
import { comparePassword, hashPassword } from '@app/utils';
import { deleteFile, saveLocalFile } from '@app/utils/file.util';

export default class UserService {
  private readonly _userRepository: UserRepository;
  private readonly _mediaRepository: MediaRepository;

  constructor() {
    this._userRepository = new UserRepository();
    this._mediaRepository = new MediaRepository();
  }

  async getUserById(id: string): Promise<User> {
    return this._userRepository.getUserById(id);
  }

  async getUserProfile(id: string): Promise<ProfileResponseType> {
    return this._userRepository.getUserProfile(id);
  }

  async getUserByEmail(id: string): Promise<ResultType<User>> {
    const user = await this._userRepository.getUserByEmail(id);

    if (!user) {
      return {
        code: ErrorCodes.USER_NOT_FOUND,
        message: 'User not found',
        success: false,
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  async verifyEmail(id: string): Promise<VerifyEmailType> {
    return this._userRepository.verifyEmail(id);
  }

  async createForgotToken(id: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');

    await this._userRepository.saveForgotToken(id, token);

    return token;
  }

  async updateProfile(id: string, input: UpdateProfileRequestType): Promise<ResultType<ProfileResponseType>> {
    try {
      return {
        success: true,
        data: await this._userRepository.updateProfile(id, input),
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          success: false,
          code: ErrorCodes.USER_NOT_FOUND,
          message: 'User not found',
        };
      }
      throw error;
    }
  }

  async changePassword(id: string, input: ChangePasswordRequestType): Promise<ResultType<void>> {
    const user = await this._userRepository.getUserById(id);

    if (!user) {
      return {
        success: false,
        code: ErrorCodes.USER_NOT_FOUND,
        message: 'User not found',
      };
    }

    const isPasswordCorrect = await comparePassword(input.oldPassword, user.passwordHash);

    if (!isPasswordCorrect) {
      return {
        success: false,
        code: ErrorCodes.INCORRECT_PASSWORD,
        message: 'Incorrect password',
      };
    }

    const { passwordHash } = await hashPassword(input.password);

    await this._userRepository.updatePassword(id, passwordHash);

    return {
      success: true,
    };
  }

  async updateUserAvatar(id: string, file: FileType): Promise<ResultType<MediaResponseType>> {
    try {
      const user = await this._userRepository.getUserProfile(id);

      if (!user) {
        return {
          success: false,
          code: ErrorCodes.USER_NOT_FOUND,
          message: 'User not found',
        };
      }

      // Save file and get path
      const result = await saveLocalFile(file, uploadFileConfig.uploadUserDir);

      if (!result.success) {
        return {
          success: false,
          code: result.code,
          message: result.message,
        };
      }

      const filePath = result.data;

      if (user.media) {
        // Delete media record
        await this._mediaRepository.deleteMedia(user.media.url);

        // Delete file
        await deleteFile(user.media.url);
      }

      const media = await this._mediaRepository.createMedia({ url: filePath });

      await this._userRepository.updateUserAvatar(id, media.id);

      const mediaResponse: MediaResponseType = {
        id: media.id,
        url: media.url,
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString(),
      };

      return {
        success: true,
        data: mediaResponse,
      };
    } catch (error) {
      return {
        success: false,
        code: ErrorCodes.UPLOAD_FILE_ERROR,
        message: error.message,
      };
    }
  }
}
