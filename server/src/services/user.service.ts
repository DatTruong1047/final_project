import crypto from 'crypto';

import { ErrorCodes } from '@app/config';
import { ResultType } from '@app/models';
import UserRepository from '@app/repositories/user.repository';
import { VerifyEmailType } from '@app/types/fastify';
import { hashPassword } from '@app/utils';
import { User } from 'generated/prisma';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<User> {
    return this._userRepository.getUserById(id);
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

  async resetPassword(forgotToken: string, password: string): Promise<ResultType<User>> {
    const user = await this._userRepository.getUserByForgotToken(forgotToken);

    if (!user) {
      return {
        code: ErrorCodes.USER_NOT_FOUND,
        message: 'User not found',
        success: false,
      };
    }

    const { passwordHash } = await hashPassword(password);

    await this._userRepository.updatePassword(user.id, passwordHash);
    await this._userRepository.deleteForgotToken(user.id);

    return {
      success: true,
      data: user,
    };
  }
}
