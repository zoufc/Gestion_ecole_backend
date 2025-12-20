import { Document } from 'mongoose';

export interface Note extends Document {
  student: string;
  course: string;
  note: number;
  updated_at: Date;
}
