import { Router } from 'express';
import * as ClassController from '../controllers/class.controller.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

const router = Router();

router.get('/',              ClassController.getAllClasses);
router.post('/',             verifyJWT, ClassController.createClass);
router.get('/myclasses',     verifyJWT, ClassController.getMyClasses);
router.patch('/:id/status',  verifyJWT, ClassController.updateClassStatus);
router.delete('/:id',        verifyJWT, ClassController.deleteClass);

export default router;