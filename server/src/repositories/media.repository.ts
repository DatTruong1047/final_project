import { Media, PrismaClient } from 'generated/prisma';

import prisma from '@app/lib/prisma';
import { CreateMediaType } from '@app/models/media.schema';

export default class MediaRepository {
  private readonly _prisma: PrismaClient;
  constructor() {
    this._prisma = prisma;
  }

  async createMedia(media: CreateMediaType): Promise<Media> {
    const newMedia = await this._prisma.media.create({
      data: {
        url: media.url,
        ...(media.description && { description: media.description }),
        ...(media.userId && { userId: media.userId }),
      },
    });

    return newMedia;
  }

  async getMediaById(id: string): Promise<Media> {
    return await this._prisma.media.findUnique({
      where: { id },
    });
  }

  async deleteMedia(url: string): Promise<void> {
    await this._prisma.media.delete({
      where: { url },
    });
  }
}
