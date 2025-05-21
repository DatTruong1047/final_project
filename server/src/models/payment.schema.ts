import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.string({
    required_error: 'Id is required',
  }),
  orderId: z.string({
    required_error: 'Order id is required',
  }),
  stripeChargeId: z.string({
    required_error: 'Stripe charge id is required',
  }),
  paymentIntentId: z.string({
    required_error: 'Payment intent id is required',
  }),
  amount: z.string({
    required_error: 'Amount is required',
  }),
  currency: z.string({
    required_error: 'Currency is required',
  }),
  paymentMethod: z.string({
    required_error: 'Payment method is required',
  }),
  status: z.string({
    required_error: 'Status is required',
  }),
  metadata: z.record(z.string(), z.string()),
  errorMessage: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePaymentRequestSchema = PaymentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePaymentRequestType = z.infer<typeof CreatePaymentRequestSchema>;

export type PaymentType = z.infer<typeof PaymentSchema>;
