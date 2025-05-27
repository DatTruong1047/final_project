import Stripe from 'stripe';

import { STRIPE_SECRET_KEY } from '@config';

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export default stripe;
