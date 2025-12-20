import { Document } from 'mongoose';

export interface Class extends Document {
  name: string;
  school: string;
  cycle: string;
  teacher: string;
  updated_at: Date;
}
