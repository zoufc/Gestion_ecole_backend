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

  async findAll(filters?: any, page: number = 1, limit: number = 10) {
    try {
      const filterQuery: any = {};
      
      if (filters) {
        if (filters.role) filterQuery.role = filters.role;
        if (filters.active !== undefined) filterQuery.active = filters.active;
        if (filters.status) filterQuery.status = filters.status;
        if (filters.school) filterQuery.school = filters.school;
        if (filters.email) filterQuery.email = filters.email;
        if (filters.phoneNumber) filterQuery.phoneNumber = filters.phoneNumber;
      }

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.userModel.find(filterQuery).skip(skip).limit(limit).exec(),
        this.userModel.countDocuments(filterQuery),
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
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
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

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email, active: true });
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
      let user;
      if (createAuthDto.phoneNumber) {
        user = await this.findByPhoneNumber(createAuthDto.phoneNumber);
      } else if (createAuthDto.email) {
        user = await this.findByEmail(createAuthDto.email);
      } else {
        throw new HttpException(
          'Phone number or email is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordMatched = await bcrypt.compare(
        createAuthDto.password,
        user.password,
      );
      if (!passwordMatched) {
        throw new HttpException(
          'Email/Phone number or password incorrect',
          HttpStatus.NOT_FOUND,
        );
      }
      return sanitizeUser(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
