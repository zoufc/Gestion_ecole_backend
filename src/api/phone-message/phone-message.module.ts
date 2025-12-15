/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PhoneMessageService } from './phone-message.service';
import { PhoneMessageController } from './phone-message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneMessageSchema } from './schemas/phone-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PhoneMessage', schema: PhoneMessageSchema },
    ]),
  ],
  controllers: [PhoneMessageController],
  providers: [PhoneMessageService],
  exports: [PhoneMessageService],
})
export class PhoneMessageModule {}
