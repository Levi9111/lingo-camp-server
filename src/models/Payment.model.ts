import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  email:          string;
  transactionId:  string;
  courseIdentity: Types.ObjectId;
  courseName?:    string;
  price:          number;
  date:           Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    email:          { type: String, required: true, lowercase: true },
    transactionId:  { type: String, required: true },
    courseIdentity: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseName:     { type: String },
    price:          { type: Number, required: true },
    date:           { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', PaymentSchema);