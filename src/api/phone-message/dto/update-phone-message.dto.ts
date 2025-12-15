import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneMessageDto } from './create-phone-message.dto';

export class UpdatePhoneMessageDto extends PartialType(CreatePhoneMessageDto) {}
