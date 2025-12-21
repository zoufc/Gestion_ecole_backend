import mongoose from 'mongoose';

export const BadgeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: true,
    unique: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: true,
  },
  qrcode: {
    type: String,
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
