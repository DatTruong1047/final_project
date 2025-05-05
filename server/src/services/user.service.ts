import UserRepository from '@app/repositories/user.repository';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async getUserById(id: string) {
    return this._userRepository.getUserById(id);
  }

  async verifiedEmail(id: string) {
    return this._userRepository.verifyEmail(id);
  }
}
