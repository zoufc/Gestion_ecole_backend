import { Document } from 'mongoose';

export interface Parent extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  platformAccess: boolean;
  userId?: string;
  created_at: Date;
  updated_at: Date;
}
