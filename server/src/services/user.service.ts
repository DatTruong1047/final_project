import { ErrorCodes } from '@app/config';
import { ResultType } from '@app/models';
import UserRepository from '@app/repositories/user.repository';
import { VerifyEmailType } from '@app/types/fastify';
import { encodeBase64 } from '@app/utils';
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

  async verifiedEmail(id: string): Promise<VerifyEmailType> {
    return this._userRepository.verifyEmail(id);
  }

  async createForgotToken(id: string): Promise<string> {
    const token = encodeBase64(id);

    await this._userRepository.saveForgotToken(id, token);

    return token;
  }
}
