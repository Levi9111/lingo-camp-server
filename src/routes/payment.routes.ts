import { Router } from 'express';
import * as PaymentController from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

const router = Router();

router.post('/create-payment-intent', verifyJWT, PaymentController.createPaymentIntent);
router.post('/payment',               verifyJWT, PaymentController.savePayment);
router.get('/history',                verifyJWT, PaymentController.getHistory);
router.delete('/history',             verifyJWT, PaymentController.clearHistory);

export default router;