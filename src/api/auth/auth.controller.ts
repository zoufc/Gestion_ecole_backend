/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import logger from 'src/utils/logger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PhoneNumberAuthDto } from './dto/phone-number-auth.dto';
import { PhoneMessageService } from '../phone-message/phone-message.service';
import { PhoneVerificationDto } from './dto/phone-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private phoneMessageService: PhoneMessageService,
  ) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      logger.info(`---AUTH.CONTROLLER.REGISTER INIT---`);
      const user = await this.authService.register(createUserDto);
      logger.info(`---AUTH.CONTROLLER.REGISTER SUCCESS---`);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      logger.error(`---AUTH.CONTROLLER.REGISTER ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto, @Res() res) {
    try {
      logger.info(`---AUTH.CONTROLLER.LOGIN INIT---`);
      const user = await this.authService.login(createAuthDto);
      logger.info(`---AUTH.CONTROLLER.LOGIN SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---AUTH.CONTROLLER.LOGIN ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Post('loginByPhoneNumber')
  async loginByPhoneNumber(
    @Body() phoneNumberAuth: PhoneNumberAuthDto,
    @Res() res,
  ) {
    try {
      logger.info(`---AUTH.CONTROLLER.LOGIN_BY_PHONE_NUMBER INIT---`);
      const user = await this.authService.loginByPhoneNumber(
        phoneNumberAuth.phoneNumber,
      );
      logger.info(`---AUTH.CONTROLLER.LOGIN_BY_PHONE_NUMBER SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(
        `---AUTH.CONTROLLER.LOGIN_BY_PHONE_NUMBER ERROR ${error}---`,
      );
      return res.status(error.status).json(error);
    }
  }

  @Post('phoneVerification')
  async phoneVerification(
    @Body() phoneVerificationDto: PhoneVerificationDto,
    @Res() res,
  ) {
    try {
      logger.info(`---AUTH.CONTROLLER.VERIFY_PHONE INIT---`);
      const phoneMessage = await this.phoneMessageService.verifyPhone(
        phoneVerificationDto,
      );
      logger.info(`---AUTH.CONTROLLER.VERIFY_PHONE SUCCESS---`);
      return res.status(HttpStatus.OK).json(phoneMessage);
    } catch (error) {
      logger.error(`---AUTH.CONTROLLER.VERIFY_PHONE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }
}
