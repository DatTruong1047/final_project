import { OrderStatusEnum, Prisma } from 'generated/prisma';
import stripe from '@app/lib/stripe';
import prisma from '@app/lib/prisma';
import PaymentRepository from '@app/repositories/payment.repository';
import { CreatePaymentRequestType } from '@model';
import Stripe from 'stripe';
import OrderService from '@app/services/order.service';
import app from '@app/app';
import { binding } from '@app/decorator/binding.decorator';
export default class PaymentService {
  private readonly _paymentRepository: PaymentRepository;
  private readonly _orderService: OrderService;

  constructor() {
    this._paymentRepository = new PaymentRepository();
    this._orderService = new OrderService();
  }

  async handleStripeEvent(event: Stripe.Event): Promise<void> {
    if (event.type.startsWith('payment_intent.')) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        throw new Error('Missing orderId in metadata');
      }

      const order = await this._orderService.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.orderStatus === OrderStatusEnum.COMPLETED) {
        app.log.info(`Order ${orderId} already completed. Skipping event processing.`);
        return;
      }

      const userId = order.userId;

      switch (event.type) {
        case 'payment_intent.succeeded':
          try {
            await this._orderService.updateOrderStatus(orderId, OrderStatusEnum.COMPLETED);
          } catch (error) {
            app.log.error(`Payment failed: ${error}`);

            try {
              await stripe.refunds.create({
                payment_intent: paymentIntent.id,
                amount: paymentIntent.amount,
                reason: 'requested_by_customer',
              });
              app.log.info(`Refund created for paymentIntent ${paymentIntent.id} due to update failure.`);
            } catch (refundError) {
              app.log.error(`Refund failed for paymentIntent ${paymentIntent.id}: ${refundError}`);
            }
          }

          await this.createPayment(paymentIntent, orderId, userId);
          break;

        case 'payment_intent.payment_failed':
        case 'payment_intent.canceled':
          await this._orderService.updateOrderStatus(orderId, OrderStatusEnum.FAILED);
          await this.createPayment(paymentIntent, orderId, userId);
          break;
      }
    }
  }

  private async createPayment(paymentIntent: Stripe.PaymentIntent, orderId: string, userId: string) {
    await this._paymentRepository.createPayment({
      orderId,
      stripeChargeId: paymentIntent.latest_charge as string,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount.toString(),
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method as string,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
      errorMessage: paymentIntent.last_payment_error?.message,
    });
  }
}
