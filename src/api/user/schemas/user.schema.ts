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
    sparse: true, // Allow multiple null values (email is optional)
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Role,
    required: true,
    default: Role.Parent,
  },
  school: {
    type: mongoose.Schema.ObjectId,
    ref: 'School',
  },
  status: {
    type: String,
    enum: UserStatus,
    default: UserStatus.PENDING,
  },
  active: {
    type: Boolean,
    default: true,
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
    // Hash password if modified
    if (this.isModified('password')) {
      const hashed = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
    }

    // Validate school requirement for Director and Teacher roles
    if (
      (this['role'] === Role.Director || this['role'] === Role.Teacher) &&
      !this['school']
    ) {
      return next(
        new Error('School is required for Director and Teacher roles'),
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
});
