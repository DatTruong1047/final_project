import prisma from '@app/lib/prisma';
import { VerifyEmailType } from '@app/types/fastify';
import { ProfileResponseType, UpdateProfileRequestType } from '@model';
import { hashPassword } from '@util';
import { PrismaClient, User } from 'generated/prisma';

export default class UserRepository {
  private readonly _prisma: PrismaClient;
  constructor() {
    this._prisma = prisma;
  }

  async getUserById(id: string): Promise<User> {
    return await this._prisma.user.findFirst({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this._prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserProfile(email: string): Promise<ProfileResponseType> {
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

  async verifyEmail(id: string): Promise<VerifyEmailType> {
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

  async updateProfile(id: string, input: UpdateProfileRequestType): Promise<User> {
    return this._prisma.user.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  async updateUserAvatar(id: string, mediaId: string): Promise<User> {
    return this._prisma.user.update({
      where: { id },
      data: {
        mediaId,
      },
    });
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const { passwordHash } = await hashPassword(password);
    return this._prisma.user.update({
      where: { id },
      data: {
        passwordHash: passwordHash,
      },
    });
  }

  async saveForgotToken(id: string, token: string): Promise<User> {
    return this._prisma.user.update({
      where: { id },
      data: {
        forgotToken: token,
      },
    });
  }
}
