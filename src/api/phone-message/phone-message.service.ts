/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhoneMessageDto } from './dto/create-phone-message.dto';
import { UpdatePhoneMessageDto } from './dto/update-phone-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhoneMessage } from './interfaces/phone-message.interface';
import { MessageTypes } from 'src/utils/enums/message_types.enum';
import { PhoneVerificationDto } from '../auth/dto/phone-verification.dto';
import {
  expirationDate,
  isCodeExpired,
} from 'src/utils/functions/expiration_date';
import logger from 'src/utils/logger';
import { generateDigits } from 'src/utils/functions/code_generation';

@Injectable()
export class PhoneMessageService {
  constructor(
    @InjectModel('PhoneMessage') private phoneMessageModel: Model<PhoneMessage>,
  ) {}
  async create(
    createPhoneMessageDto: CreatePhoneMessageDto,
    phoneNumber: string,
  ) {
    try {
      const phoneMessage = await this.phoneMessageModel.findOne({
        userId: createPhoneMessageDto.userId,
        phoneNumber,
        messageType: MessageTypes.sms,
      });
      const code = generateDigits(6);
      createPhoneMessageDto.code = code;
      createPhoneMessageDto.expirationDate = expirationDate(5);
      createPhoneMessageDto.active = true;

      if (phoneMessage) {
        createPhoneMessageDto.updated_at = new Date(Date.now());
        return await phoneMessage.updateOne(createPhoneMessageDto);
      }
      createPhoneMessageDto.phoneNumber = phoneNumber;
      return await this.phoneMessageModel.create(createPhoneMessageDto);
      // TODO
      //SEND MESSAGE BY SMS OR WHATSAPP
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async verifyPhone(phoneVerificationDto: PhoneVerificationDto) {
    try {
      logger.info(`---PHONE_MESSAGE.SERVICE.VERIFY_PHONE INIT---`);
      const phoneMessage = await this.phoneMessageModel.findOne(
        phoneVerificationDto,
      );
      if (!phoneMessage) {
        throw new HttpException(
          'Incorrect verification code',
          HttpStatus.FORBIDDEN,
        );
      }

      if (phoneMessage.active == false) {
        throw new HttpException('Already used', HttpStatus.FORBIDDEN);
      }

      if (isCodeExpired(phoneMessage.expirationDate) == true) {
        throw new HttpException('Code expired', HttpStatus.FORBIDDEN);
      }
      phoneMessage.updateOne({ active: false }).exec();
      logger.info(`---PHONE_MESSAGE.SERVICE.VERIFY_PHONE SUCCESS---`);
      return phoneMessage;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.phoneMessageModel.find().skip(skip).limit(limit),
        this.phoneMessageModel.countDocuments(),
      ]);

      return {
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const phoneMessage = await this.phoneMessageModel.findById(id);
      if (!phoneMessage) {
        throw new HttpException('Phone message not found', HttpStatus.NOT_FOUND);
      }
      return phoneMessage;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updatePhoneMessageDto: UpdatePhoneMessageDto) {
    try {
      const phoneMessage = await this.phoneMessageModel.findByIdAndUpdate(
        id,
        updatePhoneMessageDto,
        { new: true },
      );
      if (!phoneMessage) {
        throw new HttpException('Phone message not found', HttpStatus.NOT_FOUND);
      }
      return phoneMessage;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const phoneMessage = await this.phoneMessageModel.findByIdAndDelete(id);
      if (!phoneMessage) {
        throw new HttpException('Phone message not found', HttpStatus.NOT_FOUND);
      }
      return phoneMessage;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
