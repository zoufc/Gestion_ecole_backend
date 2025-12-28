import mongoose from 'mongoose';

export const ParentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  platformAccess: {
    type: Boolean,
    required: true,
    default: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
