import { PrismaClient } from '@prisma/client';

import { RefreshTokenType, RefreshTokenResponeType, FindRefreshTokenResponseType } from '@model';

import prisma from '@app/lib/prisma';

export default class AuthRepository {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async updateRefreshToken(oldToken: string, newToken: RefreshTokenType): Promise<RefreshTokenType> {
    const token = await this._prisma.token.update({
      where: { refreshToken: oldToken },
      data: {
        refreshToken: newToken.refreshToken,
        expiresAt: newToken.expiresAt,
        ipAddress: newToken.ipAddress,
      },
    });
    return token;
  }

  async findRefreshToken(token: string, ipAddress: string): Promise<FindRefreshTokenResponseType> {
    const stored_token = await this._prisma.token.findUnique({
      where: {
        refreshToken: token,
        ipAddress: ipAddress,
      },
      select: {
        refreshToken: true,
        expiresAt: true,
        ipAddress: true,
        userId: true,
        user: {
          select: {
            isAdmin: true,
            email: true,
          },
        },
      },
    });
    return stored_token;
  }

  async findTokenByUserId(userId: string, ipAddress: string): Promise<RefreshTokenResponeType | null> {
    const token = await this._prisma.token.findFirst({
      where: {
        userId: userId,
        ipAddress: ipAddress,
      },
    });

    return token;
  }

  async saveRefreshToken(input: RefreshTokenType): Promise<RefreshTokenType> {
    const new_token = await this._prisma.token.create({
      data: {
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
        ipAddress: input.ipAddress,
        userId: input.userId,
      },
    });

    return new_token;
  }

  async deleteResfeshToken(token: string): Promise<RefreshTokenResponeType> {
    const deleted_token = await this._prisma.token.delete({
      where: { refreshToken: token },
    });

    return deleted_token;
  }
}
