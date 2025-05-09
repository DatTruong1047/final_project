import { accessTokenOption, refreshTokenOption, ErrorCodes } from '@config';
import {
  LoginRequestType,
  RefreshTokenType,
  RegisterUserRequestType,
  TokenPayloadType,
  ResultType,
  LoginResponseType,
} from '@model';
import { User } from 'generated/prisma';

import AuthRepository from '@app/repositories/auth.repository';
import { comparePassword, generateToken, hashPassword } from '@app/utils';

import UserRepository from '@repository/user.repository';

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

  async refreshToken(tokem: string, ipAddress: string): Promise<ResultType<string>> {
    const oldRefreshToken = await this._authRepository.findRefreshToken(tokem, ipAddress);

    if (!oldRefreshToken) {
      return {
        code: ErrorCodes.INVALID_REFRESH_TOKEN,
        message: 'Invalid refresh token',
        success: false,
      };
    }

    if (oldRefreshToken.expiresAt < new Date()) {
      await this._authRepository.deleteResfeshToken(oldRefreshToken.refreshToken);
      return {
        code: ErrorCodes.REFRESH_TOKEN_EXPIRED,
        message: 'Refresh token expired',
        success: false,
      };
    }

    const tokenPayload: TokenPayloadType = {
      userId: oldRefreshToken.userId,
      userEmail: oldRefreshToken.user.email,
      isAdmin: oldRefreshToken.user.isAdmin,
    };

    const accessToken = generateToken(tokenPayload, accessTokenOption);

    return {
      data: accessToken,
      success: true,
    };
  }

  async comparePassword(password: string, hashed_password: string): Promise<boolean> {
    return comparePassword(password, hashed_password);
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
