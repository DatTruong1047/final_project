import { RefreshTokenType, RefreshTokenResponeType } from '@model';

import prisma from '@app/lib/prisma';

import { PrismaClient, Token } from '../../generated/prisma';

export default class AuthRepository {
  private readonly _prisma: PrismaClient;
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

  async findTokenByUserId(userId: string, ipAddress: string): Promise<Token | null> {
    const token = await this._prisma.token.findFirst({
      where: {
        userId: userId,
        ipAddress: ipAddress,
      },
    });

    return token;
  }

  async findRefreshToken(token: string, ipAddress: string): Promise<RefreshTokenResponeType | null> {
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

  async saveRefreshToken(input: RefreshTokenType) {
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

  async deleteResfeshToken(token: string) {
    const deleted_token = await this._prisma.token.delete({
      where: { refreshToken: token },
    });

    return deleted_token;
  }
}
