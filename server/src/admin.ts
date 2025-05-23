import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { UserResource, MediaResource, BrandResource, CategoryResource, ProductResource } from './admin/resource';
AdminJS.registerAdapter({ Database, Resource });

const adminOptions = {
  resources: [UserResource, MediaResource, BrandResource, CategoryResource, ProductResource],
};

export const adminJs = new AdminJS({
  resources: adminOptions.resources,
  rootPath: '/admin',
  branding: {
    companyName: 'Ecommerce',
    withMadeWithLove: false,
  },
});
