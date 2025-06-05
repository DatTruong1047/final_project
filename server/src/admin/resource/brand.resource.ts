import { getModelByName } from '@adminjs/prisma';
import PrismaModule from '../../../generated/prisma';

const prisma = new PrismaModule.PrismaClient();

export const BrandResource = {
  resource: {
    model: getModelByName('Brand', { Prisma: { dmmf: PrismaModule.Prisma.dmmf } }),
    client: prisma,
    clientModule: { Prisma: { dmmf: PrismaModule.Prisma.dmmf } },
  },
  options: {
    navigation: {
      name: 'Brand Management',
      icon: 'Brand',
    },
    actions: {
      list: {
        isAccessible: true,
        isVisible: true,
      },
      show: {
        isAccessible: true,
        isVisible: true,
      },
      edit: {
        isAccessible: true,
        isVisible: true,
      },
      delete: {
        isAccessible: true,
        isVisible: true,
      },
      new: {
        isAccessible: true,
        isVisible: true,
      },
    },
  },
};
