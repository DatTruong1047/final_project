import app from '@app/app';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import categoryRoutes from './category.route';
import productRoutes from './product.route';

export default async function registerRoutes(): Promise<void> {
  app.register(
    async () => {
      await app.register(authRoutes, { prefix: '/auth' });
      await app.register(userRoutes, { prefix: '/user' });
      await app.register(productRoutes, { prefix: '/products' });
      await app.register(categoryRoutes, { prefix: '/categories' });

    },
    { prefix: '/api' }
  );
}
