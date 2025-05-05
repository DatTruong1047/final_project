import app from '@app/app';

import authRoutes from './auth.route';

export default async function registerRoutes() {
  app.register(
    async () => {
      await app.register(authRoutes, { prefix: '/auth' });
    },
    { prefix: '/api' }
  );
}
