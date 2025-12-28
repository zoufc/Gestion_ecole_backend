import { Document } from 'mongoose';

export interface PaymentType extends Document {
  name: string;
  amount: number;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
