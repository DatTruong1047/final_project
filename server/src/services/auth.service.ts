import { comparePassword, generateToken, hashPassword } from '@app/utils';
import { accessTokenOption, refreshTokenOption, ErrorCodes } from '@config';
import {
  LoginRequestType,
  RefreshTokenType,
  RegisterUserRequestType,
  TokenPayloadType,
  ResultType,
  LoginResponseType,
} from '@model';
import AuthRepository from '@repository/auth.repository';
import UserRepository from '@repository/user.repository';
import { User } from 'generated/prisma';

export default class AuthService {
  private readonly _authRepository: AuthRepository;
  private readonly _userRepository: UserRepository;

  constructor() {
    this._authRepository = new AuthRepository();
    this._userRepository = new UserRepository();
  }

  async register(req: RegisterUserRequestType): Promise<ResultType<User>> {
    const existUser = await this._userRepository.getUserByEmail(req.email);

    if (existUser) {
      return {
        code: ErrorCodes.EMAIL_ALREADY_EXISTS,
        message: 'Email has already been used',
        success: false,
      };
    }

    const { passwordHash } = await hashPassword(req.password);
    const user = await this._userRepository.createUser(req.email, passwordHash);

    return {
      success: true,
      data: user,
    };
  }

  async login(req: LoginRequestType): Promise<ResultType<User>> {
    const existUser = await this._userRepository.getUserByEmail(req.email);

    if (!existUser) {
      return {
        code: ErrorCodes.USER_NOT_FOUND,
        message: 'User not found',
        success: false,
      };
    }

    if (!existUser.isVerifiedEmail) {
      return {
        code: ErrorCodes.EMAIL_IS_NOT_VERIFIED,
        message: 'User is not verified',
        success: false,
      };
    }

    const isComparedPass = await comparePassword(req.password, existUser.passwordHash);
    if (!isComparedPass) {
      return {
        code: ErrorCodes.INCORRECT_PASSWORD,
        message: 'Incorrect password',
        success: false,
      };
    }

    return {
      data: existUser,
      success: true,
    };
  }

  async refreshToken(oldRefreshToken: string, newRefreshToken: RefreshTokenType): Promise<RefreshTokenType> {
    const token = await this._authRepository.updateRefreshToken(oldRefreshToken, newRefreshToken);
    return token;
  }

  generateTokens(payload: TokenPayloadType): LoginResponseType {
    const refreshTokenPayload: TokenPayloadType = {
      userId: payload.userId,
    };

    const accessToken = generateToken(payload, accessTokenOption);
    const refreshToken = generateToken(refreshTokenPayload, refreshTokenOption);

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(token: RefreshTokenType): Promise<RefreshTokenType> {
    const existingToken = await this._authRepository.findTokenByUserId(token.userId, token.ipAddress);

    if (existingToken) {
      const updatedToken = this._authRepository.updateRefreshToken(existingToken.refreshToken, token);
      return updatedToken;
    }

    const newToken = this._authRepository.saveRefreshToken(token);
    return newToken;
  }

  async deleteRefreshToken(token: string): Promise<RefreshTokenType> {
    const deletedToken = this._authRepository.deleteResfeshToken(token);
    return deletedToken;
  }
}
