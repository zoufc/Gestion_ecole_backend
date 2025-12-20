import { Document } from 'mongoose';

export interface Payment extends Document {
  amount: number;
  student: string;
  created_at: Date;
  updated_at: Date;
}
