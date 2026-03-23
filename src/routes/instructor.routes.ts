import { Router } from 'express';
import { Instructor } from '../models/Instructor.model.js';

const router = Router();

// Simple enough to inline — no separate controller needed
router.get('/', async (req, res) => {
  const instructors = await Instructor.find().sort({ students: -1 });
  res.json(instructors);
});

export default router;
