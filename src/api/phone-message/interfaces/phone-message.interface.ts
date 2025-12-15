/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';

export interface PhoneMessage extends Document {
  userId: string;
  messageType: string;
  phoneNumber: string;
  code: number;
  sentFor: string;
  expirationDate: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
