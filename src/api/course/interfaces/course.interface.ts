import { Document } from 'mongoose';

export interface Course extends Document {
  name: string;
  description: string;
  class: string;
  created_at: Date;
  updated_at: Date;
}
