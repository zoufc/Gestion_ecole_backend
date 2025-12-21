import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import logger from 'src/utils/logger';

@Injectable()
export class PromobileSmsService {
  constructor(private configService: ConfigService) {}
  promobileAxios = axios.create();
  promobileSmsUrl = this.configService.get('promobileSmsUrl');
  promobileSmsAccessKey = this.configService.get('promobileSmsAccessKey');

  async sendSms(smsObject: { from: string; to: string; content: string }) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Token: this.promobileSmsAccessKey,
        },
      };
      const result = await this.promobileAxios.post(
        this.promobileSmsUrl,
        {
          from: smsObject.from,
          to: smsObject.to,
          content: smsObject.content,
        },
        config,
      );

      return result.data;
    } catch (error) {
      logger.error(`---PROMOBILE SEND SMS ERROR ${error}---`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
