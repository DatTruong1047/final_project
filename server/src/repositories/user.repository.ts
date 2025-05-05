import { UpdateProfileRequestType } from '@model';
import { hashPassword } from '@util';
import { PrismaClient, User } from 'generated/prisma';

import prisma from '@app/lib/prisma';

export default class UserRepository {
  private readonly _prisma: PrismaClient;
  constructor() {
    this._prisma = prisma;
  }

  async getUserById(id: string) {
    return await this._prisma.user.findFirst({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return await this._prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserProfile(email: string) {
    return this._prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        fullName: true,
        phoneNumber: true,
        address: true,
        media: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  async createUser(email: string, password: string): Promise<User> {
    const { passwordHash } = await hashPassword(password);

    const user = await this._prisma.user.create({
      data: {
        email,
        passwordHash: passwordHash,
      },
    });

    return user;
  }

  async verifyEmail(id: string) {
    return this._prisma.user.update({
      where: { id },
      data: {
        isVerifiedEmail: true,
      },
      select: {
        id: true,
        email: true,
        isVerifiedEmail: true,
      },
    });
  }

  async updateProfile(id: string, input: UpdateProfileRequestType) {
    return this._prisma.user.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  async updateUserAvatar(id: string, mediaId: string) {
    return this._prisma.user.update({
      where: { id },
      data: {
        mediaId,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    const { passwordHash } = await hashPassword(password);
    return this._prisma.user.update({
      where: { id },
      data: {
        passwordHash: passwordHash,
      },
    });
  }

  async saveForgotToken(id: string, token: string) {
    return this._prisma.user.update({
      where: { id },
      data: {
        forgotToken: token,
      },
    });
  }
}
