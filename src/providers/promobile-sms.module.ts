import { Module } from '@nestjs/common';
import { PromobileSmsService } from './promobile-sms.service';

@Module({
  providers: [PromobileSmsService],
  exports: [PromobileSmsService],
})
export class PromobileSmsModule {}

