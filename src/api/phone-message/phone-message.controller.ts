/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhoneMessageService } from './phone-message.service';
import { CreatePhoneMessageDto } from './dto/create-phone-message.dto';
import { UpdatePhoneMessageDto } from './dto/update-phone-message.dto';

@Controller('phone-message')
export class PhoneMessageController {
  constructor(private readonly phoneMessageService: PhoneMessageService) {}

  @Post()
  create(@Body() createPhoneMessageDto: CreatePhoneMessageDto) {}

  @Get()
  findAll() {
    return this.phoneMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phoneMessageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhoneMessageDto: UpdatePhoneMessageDto,
  ) {
    return this.phoneMessageService.update(+id, updatePhoneMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phoneMessageService.remove(+id);
  }
}
