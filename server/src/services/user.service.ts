import UserRepository from '@app/repositories/user.repository';
import { verifyEmail } from '@app/types/fastify';
import { User } from 'generated/prisma';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<User> {
    return this._userRepository.getUserById(id);
  }

  async verifiedEmail(id: string): Promise<verifyEmail> {
    return this._userRepository.verifyEmail(id);
  }
}
