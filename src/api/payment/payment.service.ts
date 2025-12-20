import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Model } from 'mongoose';
import { Payment } from './interfaces/payment.interface';
import logger from 'src/utils/logger';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentService {
  constructor(@InjectModel('Payment') private paymentModel: Model<Payment>) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      logger.info('---PAYMENT.SERVICE.CREATE INIT---');
      const payment = await this.paymentModel.create(createPaymentDto);
      logger.info('---PAYMENT.SERVICE.CREATE SUCCESS---');
      return payment;
    } catch (error) {
      logger.error(`---PAYMENT.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.paymentModel.find().populate(['student']);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.paymentModel
        .findById(id)
        .populate(['student']);
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentModel.findByIdAndUpdate(
        id,
        { ...updatePaymentDto, updated_at: new Date() },
        { new: true },
      );
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const payment = await this.paymentModel.findByIdAndDelete(id);
      if (!payment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return payment;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
