import mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true,
  },
  note: {
    type: Number,
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
