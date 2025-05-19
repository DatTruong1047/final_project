import { FastifyReply, FastifyRequest } from 'fastify';

import PaymentService from '@app/services/payment.service';

import { binding } from '@decorators/binding.decorator';
import app from '@app/app';
import Stripe from 'stripe';
import stripe from '@app/lib/stripe';
import { SuccessResWithoutDataType } from '@app/models';

export default class PaymentController {
  constructor(private readonly _paymentService: PaymentService) {}

  @binding
  async handlePaymentWebhook(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const sig = request.headers['stripe-signature'];

      if (!sig || typeof sig !== 'string') {
        return reply.BadRequest({
          code: 400,
          message: 'Missing stripe-signature header',
        });
      }

      let event: Stripe.Event;

      const rawBody = request.rawBody as string;

      event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

      await this._paymentService.handleStripeEvent(event);

      const response: SuccessResWithoutDataType = {
        code: 200,
        success: true,
      };

      return reply.OK(response);
    } catch (error) {
      return app.handleErrorResponse(error, reply);
    }
  }
}
