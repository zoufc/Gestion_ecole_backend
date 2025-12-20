import mongoose from 'mongoose';

export const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: true,
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
