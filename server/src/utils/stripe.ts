import {  STRIPE_SECRET_KEY } from '@config';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY as string);

export const createPaymentIntent = async (amount: number, orderId: string, userId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount / 100,
    currency: 'vnd',
    metadata: {
      orderId,
      userId,
    },
  });

  return paymentIntent;
};

export default stripe;
