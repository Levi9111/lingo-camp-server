import { Schema, model, Document } from 'mongoose';

export interface IClass extends Document {
  name:           string;
  email:          string;         // instructor email
  image?:         string;
  price:          number;
  availableSeats: number;
  enrolled?:      number;
  status?:        'pending' | 'approved' | 'denied';
}

const ClassSchema = new Schema<IClass>(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true },
    image:          { type: String },
    price:          { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    enrolled:       { type: Number, default: 0 },
    status:         { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  },
  { timestamps: true }
);

export const Class = model<IClass>('Class', ClassSchema);