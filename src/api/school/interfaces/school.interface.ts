import { Document } from 'mongoose';

export interface School extends Document {
  name: string;
  address: string;
  director: string;
  updated_at: Date;
}
