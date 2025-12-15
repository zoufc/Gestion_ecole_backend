/* eslint-disable @typescript-eslint/no-empty-function */
import { IsNotEmpty, IsOptional } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreatePhoneMessageDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  messageType: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  code: number;

  @IsOptional()
  sentFor: string;

  @IsOptional()
  expirationDate: Date;

  @IsOptional()
  updated_at: Date;

  @IsOptional()
  active: boolean;

  constructor(
    userId: string,
    messageType: string,
    sentFor: string,
    expirationDate: Date | any,
    updated_at: Date | any,
  ) {
    this.userId = userId;
    this.messageType = messageType;
    this.sentFor = sentFor;
    this.expirationDate = expirationDate;
    this.active = true;
    this.updated_at = updated_at;
  }
}
