import * as mongoose from 'mongoose';

export const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.ObjectId,
    ref: 'School',
    required: true,
  },
  cycle: {
    type: mongoose.Schema.ObjectId,
    ref: 'Cycle',
    required: true,
  },
  teacher: {
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
