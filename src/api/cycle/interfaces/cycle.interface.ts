import { Document } from 'mongoose';

export interface Cycle extends Document {
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}


