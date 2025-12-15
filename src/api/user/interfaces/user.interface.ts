/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable prettier/prettier */

import { Document } from 'mongoose';

export interface User extends Document {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  role: string;
  codePin: string;
  status: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
