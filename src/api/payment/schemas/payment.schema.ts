import mongoose from 'mongoose';
import { PaymentMethod } from '../../../utils/enums/payment_method.enum';
import { PaymentStatus } from '../../../utils/enums/payment_status.enum';

export const PaymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  method: {
    type: String,
    enum: PaymentMethod,
    required: true,
  },
  reference: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: PaymentStatus,
    required: true,
    default: PaymentStatus.PENDING,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});
