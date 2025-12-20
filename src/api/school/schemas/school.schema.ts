import mongoose from 'mongoose';

export const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
  },
  director: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
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
