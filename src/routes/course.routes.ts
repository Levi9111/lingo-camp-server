import { Router } from 'express';
import * as CourseController from '../controllers/course.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT';

const router = Router();

router.get('/',                     CourseController.getCourses);
router.post('/',       verifyJWT,   CourseController.createCourse);
router.delete('/:id',  verifyJWT,   CourseController.deleteCourse);
router.patch('/:id/decrease-seats', CourseController.decreaseSeats);

export default router;