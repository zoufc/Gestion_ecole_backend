/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { MessageSentFor } from 'src/utils/enums/message_sent_for.enum';
import { MessageTypes } from 'src/utils/enums/message_types.enum';

export const PhoneMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  messageType: {
    type: String,
    enum: MessageTypes,
    default: MessageTypes.sms,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  sentFor: {
    type: String,
    enum: MessageSentFor,
    required: true,
    default: MessageSentFor.phoneNumberVerification,
  },
  expirationDate: {
    type: Date,
    required: true,
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
