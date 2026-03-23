// src/controllers/course.controller.ts
import { Request, Response } from 'express';
import { Course } from '../models/Course.model';

export const getCourses = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email) return res.json([]);
  const courses = await Course.find({ email });
  res.json(courses);
};

export const createCourse = async (req: Request, res: Response) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const result = await Course.findByIdAndDelete(req.params.id);
  res.json(result);
};

export const decreaseSeats = async (req: Request, res: Response) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $inc: { availableSeats: -1 } },   // atomic — no manual fetch needed
    { new: true }
  );
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ message: 'Seats decreased', availableSeats: course.availableSeats });
};