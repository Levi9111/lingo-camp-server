import { Schema, model, Document } from 'mongoose';

export interface IInstructor extends Document {
  name:        string;
  email:       string;
  image?:      string;
  numClasses?: number;
  students?:   number;
}

const InstructorSchema = new Schema<IInstructor>(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    image:       { type: String },
    numClasses:  { type: Number, default: 0 },
    students:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Instructor = model<IInstructor>('Instructor', InstructorSchema);