import { Schema, model, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  email:          string;         // student email (cart item owner)
  classId:        Types.ObjectId; // reference to the actual class
  name:           string;
  image?:         string;
  price:          number;
  availableSeats: number;
  instructor?:    string;
}

const CourseSchema = new Schema<ICourse>(
  {
    email:          { type: String, required: true, lowercase: true },
    classId:        { type: Schema.Types.ObjectId, ref: 'Class' },
    name:           { type: String, required: true },
    image:          { type: String },
    price:          { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    instructor:     { type: String },
  },
  { timestamps: true }
);

export const Course = model<ICourse>('Course', CourseSchema);