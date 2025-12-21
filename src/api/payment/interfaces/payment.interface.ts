import { Document } from 'mongoose';
import { PaymentMethod } from '../../../utils/enums/payment_method.enum';
import { PaymentStatus } from '../../../utils/enums/payment_status.enum';

export interface Payment extends Document {
  student: string;
  month: string;
  amount: number;
  paymentDate: Date;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}
