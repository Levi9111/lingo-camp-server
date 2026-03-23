// src/routes/user.routes.ts
import { Router } from 'express';
import * as UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/',                  UserController.getAllUsers);
router.post('/',                 UserController.createUser);
router.patch('/admin/:id',       UserController.makeAdmin);
router.patch('/instructor/:id',  UserController.makeInstructor);

export default router;