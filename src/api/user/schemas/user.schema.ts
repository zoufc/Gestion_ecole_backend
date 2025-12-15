/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/utils/enums/roles.enum';
import { UserStatus } from 'src/utils/enums/user_status.enum';
export const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  codePin: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.Customer,
  },
  status: {
    type: String,
    enum: UserStatus,
    default: UserStatus.PENDING,
  },
  active: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('codePin')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['codePin'], 10);
    this['codePin'] = hashed;
    return next();
  } catch (error) {
    throw next(error);
  }
});
