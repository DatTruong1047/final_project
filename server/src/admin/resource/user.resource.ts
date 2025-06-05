import { getModelByName } from '@adminjs/prisma';
import PrismaModule from '../../../generated/prisma';

const prisma = new PrismaModule.PrismaClient();

export const UserResource = {
  resource: {
    model: getModelByName('User', { Prisma: { dmmf: PrismaModule.Prisma.dmmf } }),
    client: prisma,
    clientModule: { Prisma: { dmmf: PrismaModule.Prisma.dmmf } },
  },
  options: {
    navigation: {
      name: 'User Management',
      icon: 'User',
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
      listProperties: ['id', 'email', 'createdAt', 'updatedAt'],
    },
  },
};
