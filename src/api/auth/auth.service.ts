/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import logger from 'src/utils/logger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { PhoneMessageService } from '../phone-message/phone-message.service';
import { CreatePhoneMessageDto } from '../phone-message/dto/create-phone-message.dto';
import { sanitizeUser } from 'src/utils/functions/sanitizer';
import { MessageSentFor } from 'src/utils/enums/message_sent_for.enum';
import { MessageTypes } from 'src/utils/enums/message_types.enum';
import { PhoneVerificationDto } from './dto/phone-verification.dto';
import { expirationDate } from 'src/utils/functions/expiration_date';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private phoneMessageService: PhoneMessageService,
  ) {}
  async generateToken(user: any) {
    try {
      const payload = { phoneNumber: user.phoneNumber, userId: user._id };
      return this.jwtService.sign(payload, {
        secret: this.configService.get<string>('privateKey'),
        expiresIn: '1d',
      });
    } catch (error) {
      logger.error(`---GENERATE TOKEN ERROR ${error}`);
      throw new HttpException(error.message, error.status);
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('privateKey'),
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async login(createAuthDto: CreateAuthDto) {
    try {
      logger.info(`---AUTH.SERVICE.LOGIN INIT---`);
      const user = await this.userService.findLogin(createAuthDto);
      const token = await this.generateToken(user);
      logger.info(`---AUTH.SERVICE.LOGIN SUCCESS---`);
      return { user: user, token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      logger.info(`---AUTH.SERVICE.REGISTER INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---AUTH.SERVICE.REGISTER SUCCESS---`);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByPhoneNumber(phoneNumber: string) {
    try {
      const user = await this.userService.findByPhoneNumber(phoneNumber);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async loginByPhoneNumber(phoneNumber: string) {
    try {
      const user = await this.findByPhoneNumber(phoneNumber);
      const phoneMessageDto = new CreatePhoneMessageDto(
        user._id,
        MessageTypes.sms,
        MessageSentFor.phoneNumberVerification,
        expirationDate(5),
        Date.now(),
      );
      const phoneMessage = this.phoneMessageService.create(
        phoneMessageDto,
        phoneNumber,
      );
      return { phoneNumber };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async phoneVerification(phoneVerificationDto: PhoneVerificationDto) {
    try {
    } catch (error) {}
  }
}
