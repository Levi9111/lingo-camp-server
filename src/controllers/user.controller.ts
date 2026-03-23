// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../models/User.model.js';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create(req.body);
  res.status(201).json(user);
};

export const makeAdmin = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role1: 'Admin' } },
    { new: true },
  );
  res.json(user);
};

export const makeInstructor = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role2: 'Instructor' } },
    { new: true },
  );
  res.json(user);
};
