import prisma from '@app/lib/prisma';
import { CategoryListType } from '@model';
import { PrismaClient } from 'generated/prisma';

export default class CategoryRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async getCategoryList(): Promise<CategoryListType> {
    const categories = await this._prisma.category.findMany();
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      total: categories.length,
    };
  }
}
