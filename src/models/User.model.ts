import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email:     string;
  name?:     string;
  photoURL?: string;
  role1?:    'Admin';
  role2?:    'Instructor';
}

const UserSchema = new Schema<IUser>(
  {
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    name:      { type: String, trim: true },
    photoURL:  { type: String },
    role1:     { type: String, enum: ['Admin'] },
    role2:     { type: String, enum: ['Instructor'] },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);