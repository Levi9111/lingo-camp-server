import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const issueToken = (req: Request, res: Response) => {
  const user = req.body;

  if (!user?.email) {
    return res.status(400).json({ error: true, message: 'Email is required' });
  }

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '1h',
  });

  res.json({ token });
};