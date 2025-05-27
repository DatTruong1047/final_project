import { FastifyInstance } from 'fastify';

import PaymentController from '@app/controllers/payment.controller';
import { ErrorResponseSchema, SuccessResWithoutDataSchema } from '@app/models';
import PaymentService from '@app/services/payment.service';

export default async function paymentRoutes(app: FastifyInstance): Promise<void> {
  const paymentController = new PaymentController(new PaymentService());

  app.post('/webhook', {
    schema: {
      tags: ['Payment'],
      config: {
        rawBody: true,
      },
      response: {
        200: SuccessResWithoutDataSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },

    handler: paymentController.handlePaymentWebhook,
  });
}
