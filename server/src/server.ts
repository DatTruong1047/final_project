import * as config from '@config';
import fastifyAuth from '@fastify/auth';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import app from './app';

const PORT = config.PORT || 3000;
const startServer = async () => {
  try {
    // CROS
    app.register(fastifyCors, {
      origin: ['*'],
      methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Swagger
    app.register(fastifySwagger, config.swaggerConfig);
    app.register(fastifySwaggerUI, {
      routePrefix: '/api/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
    });

    // JWT
    app.register(fastifyJwt, {
      secret: config.SECRET_KEY,
    });

    // Auth
    app.register(fastifyAuth);

    await app.listen({ port: PORT, host: '0.0.0.0' });

    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
