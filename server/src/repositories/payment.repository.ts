import stripe from '@app/lib/stripe';
import prisma from '@app/lib/prisma';
import { PrismaClient } from 'generated/prisma';
import { CreatePaymentRequestType, PaymentType } from '@app/models';
export default class PaymentRepository {
  private readonly _prisma: PrismaClient;

  constructor() {
    this._prisma = prisma;
  }

  async createPayment(payment: CreatePaymentRequestType) {
    const { orderId, ...paymentData } = payment;
    
    if (!paymentData.stripeChargeId || !paymentData.paymentIntentId || 
        !paymentData.amount || !paymentData.currency || 
        !paymentData.paymentMethod || !paymentData.status) {
      throw new Error('Required payment fields are missing');
    }
    
    return this._prisma.payment.create({
      data: {
        stripeChargeId: paymentData.stripeChargeId,
        paymentIntentId: paymentData.paymentIntentId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        status: paymentData.status,
        metadata: paymentData.metadata || {},
        errorMessage: paymentData.errorMessage,
        order: {
          connect: { id: orderId }
        }
      },
    });
  }
}
