import { SwaggerOptions } from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Project',
      description: 'Fastify API with Swagger',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Endpoints related to Authenticate' },
      { name: 'Category', description: 'Endpoints related to Categories' },
      { name: 'User', description: 'Endpoints related to Users' },
      { name: 'Product', description: 'Endpoints related to Posts' },
      { name: 'Media', description: 'Endpoints related to Media' },
      { name: 'Review', description: 'Endpoints related to Comment' },
      { name: 'Admin', description: 'Endpoints related to Admin' },
      { name: 'Test', description: 'Endpoint to test api' },
    ],
  },
  hideUntagged: true,
  transform: jsonSchemaTransform,
};
