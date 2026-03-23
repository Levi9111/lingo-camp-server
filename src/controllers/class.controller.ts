import { Request, Response } from 'express';
import { Class } from '../models/Class.model.js';

export const getAllClasses = async (req: Request, res: Response) => {
  const classes = await Class.find().sort({ createdAt: -1 });
  res.json(classes);
};

export const getMyClasses = async (req: Request, res: Response) => {
  const decoded = (req as any).decoded;
  const classes = await Class.find({ email: decoded.email });
  res.json(classes);
};

export const createClass = async (req: Request, res: Response) => {
  const newClass = await Class.create(req.body);
  res.status(201).json(newClass);
};

export const updateClassStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!['approved', 'denied', 'pending'].includes(status)) {
    return res.status(400).json({ error: true, message: 'Invalid status value' });
  }

  const updated = await Class.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: true, message: 'Class not found' });

  res.json(updated);
};

export const deleteClass = async (req: Request, res: Response) => {
  const result = await Class.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: true, message: 'Class not found' });
  res.json({ message: 'Class deleted successfully' });
};