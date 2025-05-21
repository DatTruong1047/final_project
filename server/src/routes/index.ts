import app from '@app/app';

import authRoutes from './auth.route';
import cartRoutes from './cart.route';
import categoryRoutes from './category.route';
import chatRoutes from './chat.route';
import productRoutes from './product.route';
import userRoutes from './user.route';
import orderRoutes from './order.route';
import paymentRoutes from './payment.route';

export default async function registerRoutes(): Promise<void> {
  app.register(
    async () => {
      await app.register(authRoutes, { prefix: '/auth' });
      await app.register(userRoutes, { prefix: '/user' });
      await app.register(productRoutes, { prefix: '/products' });
      await app.register(categoryRoutes, { prefix: '/categories' });
      await app.register(cartRoutes, { prefix: '/cart' });
      await app.register(chatRoutes, { prefix: '/chat' });
      await app.register(orderRoutes, { prefix: '/order' });
      await app.register(paymentRoutes, { prefix: '/payment' });
    },
    { prefix: '/api' }
  );
}
