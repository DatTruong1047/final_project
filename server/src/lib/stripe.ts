import { STRIPE_SECRET_KEY } from '@config';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

export default stripe;
