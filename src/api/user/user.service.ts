/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import logger from 'src/utils/logger';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { sanitizeUser } from 'src/utils/functions/sanitizer';
import { PhoneMessageService } from '../phone-message/phone-message.service';
import { CreatePhoneMessageDto } from '../phone-message/dto/create-phone-message.dto';
import { MessageTypes } from 'src/utils/enums/message_types.enum';
import { MessageSentFor } from 'src/utils/enums/message_sent_for.enum';
import { expirationDate } from 'src/utils/functions/expiration_date';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private phoneMessageService: PhoneMessageService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      logger.info(`---USER.SERVICE.CREATE INIT---`);
      await this.checkPhoneNumber(createUserDto.phoneNumber);
      const user = await this.userModel.create(createUserDto);
      const phoneMessageDto = new CreatePhoneMessageDto(
        user._id.toString(),
        MessageTypes.sms,
        MessageSentFor.phoneNumberVerification,
        expirationDate(5),
        Date.now(),
      );
      const phoneMessage = this.phoneMessageService.create(
        phoneMessageDto,
        createUserDto.phoneNumber,
      );
      logger.info(`---USER.SERVICE.CREATE SUCCESS---`);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ phoneNumber, active: true });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async checkPhoneNumber(phoneNumber: string) {
    try {
      const user = await this.userModel.findOne({
        phoneNumber,
      });
      if (user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findLogin(createAuthDto: CreateAuthDto) {
    try {
      const user = await this.findByPhoneNumber(createAuthDto.phoneNumber);
      const passwordMatched = await bcrypt.compare(
        createAuthDto.password,
        user.password,
      );
      if (!passwordMatched) {
        throw new HttpException(
          'Phone number or password incorrect',
          HttpStatus.NOT_FOUND,
        );
      }
      return sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
