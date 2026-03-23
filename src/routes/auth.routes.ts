import { Router } from 'express';
import { issueToken } from '../controllers/auth.controller.js';

const router = Router();

router.post('/', issueToken);

export default router;