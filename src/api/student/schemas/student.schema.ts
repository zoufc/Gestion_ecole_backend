import mongoose from 'mongoose';
import { GenderEnum } from '../../../utils/enums/genders.enum';

export const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: GenderEnum,
    required: true,
    default: GenderEnum.MALE,
  },
  class: {
    type: mongoose.Schema.ObjectId,
    ref: 'Class',
    required: true,
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Parent',
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
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
