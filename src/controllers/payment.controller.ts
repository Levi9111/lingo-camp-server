import { Request, Response } from 'express';
import { stripe } from '../config/stripe.js';
import { Payment } from '../models/Payment.model.js';
import { Course } from '../models/Course.model.js';
import { Class } from '../models/Class.model.js';

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { price } = req.body;

  if (!price || isNaN(+price)) {
    return res.status(400).json({ error: true, message: 'Valid price is required' });
  }

  const amount = Math.round(+price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

export const savePayment = async (req: Request, res: Response) => {
  const payment = req.body;

  // 1. Save payment record
  const savedPayment = await Payment.create(payment);

  // 2. Remove course from cart
  const deletedCourse = await Course.findByIdAndDelete(payment.courseIdentity);

  // 3. Decrement available seats on the class atomically
  if (deletedCourse?.classId) {
    await Class.findByIdAndUpdate(
      deletedCourse.classId,
      { $inc: { availableSeats: -1, enrolled: 1 } }
    );
  }

  res.status(201).json({ savedPayment, deletedCourse });
};

export const getHistory = async (req: Request, res: Response) => {
  const decoded = (req as any).decoded;

  // Admins get all history, students get their own
  const query = decoded.role1 === 'Admin' ? {} : { email: decoded.email };

  const history = await Payment.find(query).sort({ date: -1 });
  res.json(history);
};

export const clearHistory = async (req: Request, res: Response) => {
  const result = await Payment.deleteMany({});
  res.json({ message: `Deleted ${result.deletedCount} records` });
};