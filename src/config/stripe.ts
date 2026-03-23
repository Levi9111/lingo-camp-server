import Stripe from 'stripe';

export const stripe = new Stripe(process.env.PAYMENT_SECRET_KEY!, {
    // @ts-ignore
  apiVersion: '2023-10-16',
});