import app from '@app/app';

import authRoutes from './auth.route';

export default async function registerRoutes(): Promise<void> {
  app.register(
    async () => {
      await app.register(authRoutes, { prefix: '/auth' });
    },
    { prefix: '/api' }
  );
}
