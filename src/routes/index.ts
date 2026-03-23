import { Router } from 'express';
import authRoutes        from './auth.routes';
import userRoutes        from './user.routes';
import classRoutes       from './class.routes';
import courseRoutes      from './course.routes';
import paymentRoutes     from './payment.routes';
import instructorRoutes  from './instructor.routes';

const router = Router();

router.use('/jwt',          authRoutes);
router.use('/users',        userRoutes);
router.use('/classes',      classRoutes);
router.use('/courses',      courseRoutes);
router.use('/instructors',  instructorRoutes);
router.use('/',             paymentRoutes);

export default router;