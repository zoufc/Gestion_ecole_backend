import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentType } from './interfaces/payment-type.interface';
import logger from 'src/utils/logger';

@Injectable()
export class PaymentTypeService {
  constructor(
    @InjectModel('PaymentType')
    private paymentTypeModel: Model<PaymentType>,
  ) {}

  async create(createPaymentTypeDto: CreatePaymentTypeDto) {
    try {
      logger.info('---PAYMENT_TYPE.SERVICE.CREATE INIT---');
      const paymentType = await this.paymentTypeModel.create(
        createPaymentTypeDto,
      );
      logger.info('---PAYMENT_TYPE.SERVICE.CREATE SUCCESS---');
      return paymentType;
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.SERVICE.CREATE ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.paymentTypeModel.find().skip(skip).limit(limit),
        this.paymentTypeModel.countDocuments(),
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

  async findOne(id: string) {
    try {
      const paymentType = await this.paymentTypeModel.findById(id);
      if (!paymentType) {
        throw new HttpException(
          'PaymentType not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return paymentType;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updatePaymentTypeDto: UpdatePaymentTypeDto) {
    try {
      const paymentType = await this.paymentTypeModel.findByIdAndUpdate(
        id,
        { ...updatePaymentTypeDto, updated_at: new Date() },
        { new: true },
      );
      if (!paymentType) {
        throw new HttpException(
          'PaymentType not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return paymentType;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const paymentType = await this.paymentTypeModel.findByIdAndDelete(id);
      if (!paymentType) {
        throw new HttpException(
          'PaymentType not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return paymentType;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
