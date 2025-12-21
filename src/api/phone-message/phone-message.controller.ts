/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PhoneMessageService } from './phone-message.service';
import { CreatePhoneMessageDto } from './dto/create-phone-message.dto';
import { UpdatePhoneMessageDto } from './dto/update-phone-message.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('phone-messages')
export class PhoneMessageController {
  constructor(private readonly phoneMessageService: PhoneMessageService) {}

  @Post()
  async create(
    @Body() createPhoneMessageDto: CreatePhoneMessageDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PHONE_MESSAGE.CONTROLLER.CREATE INIT---');
      const phoneMessage = await this.phoneMessageService.create(
        createPhoneMessageDto,
        createPhoneMessageDto.phoneNumber,
      );
      logger.info('---PHONE_MESSAGE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(phoneMessage);
    } catch (error) {
      logger.error(
        `---PHONE_MESSAGE.CONTROLLER.CREATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      logger.info('---PHONE_MESSAGE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.phoneMessageService.findAll(
        pageNumber,
        limitNumber,
      );
      logger.info('---PHONE_MESSAGE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(
        `---PHONE_MESSAGE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PHONE_MESSAGE.CONTROLLER.FIND_ONE INIT---');
      const message = await this.phoneMessageService.findOne(id);
      logger.info('---PHONE_MESSAGE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(message);
    } catch (error) {
      logger.error(
        `---PHONE_MESSAGE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhoneMessageDto: UpdatePhoneMessageDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PHONE_MESSAGE.CONTROLLER.UPDATE INIT---');
      const message = await this.phoneMessageService.update(
        id,
        updatePhoneMessageDto,
      );
      logger.info('---PHONE_MESSAGE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(message);
    } catch (error) {
      logger.error(
        `---PHONE_MESSAGE.CONTROLLER.UPDATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PHONE_MESSAGE.CONTROLLER.REMOVE INIT---');
      const message = await this.phoneMessageService.remove(id);
      logger.info('---PHONE_MESSAGE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(message);
    } catch (error) {
      logger.error(
        `---PHONE_MESSAGE.CONTROLLER.REMOVE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
