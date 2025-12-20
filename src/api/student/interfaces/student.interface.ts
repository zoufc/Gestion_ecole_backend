import { Document } from 'mongoose';

export interface Student extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  class: string;
  parentEmail?: string;
  parentPhoneNumber: string;
  code: string;
  created_at: Date;
  updated_at: Date;
}
