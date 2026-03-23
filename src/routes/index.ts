import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import classRoutes from './class.routes.js';
import courseRoutes from './course.routes.js';
import paymentRoutes from './payment.routes.js';
import instructorRoutes from './instructor.routes.js';

const router = Router();

router.use('/jwt', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/courses', courseRoutes);
router.use('/instructors', instructorRoutes);
router.use('/', paymentRoutes);

export default router;
