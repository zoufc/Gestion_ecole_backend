import { Document } from 'mongoose';

export interface Badge extends Document {
  code: string;
  student: string;
  issuedAt: Date;
  active: boolean;
  qrcode: string;
  created_at: Date;
  updated_at: Date;
}

