import mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
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
