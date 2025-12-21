import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Model } from 'mongoose';
import { Payment } from './interfaces/payment.interface';
import logger from 'src/utils/logger';
import { InjectModel } from '@nestjs/mongoose';
import { generateAlphanumericCode } from 'src/utils/functions/code_generation';

@Injectable()
export class PaymentService {
  constructor(@InjectModel('Payment') private paymentModel: Model<Payment>) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      logger.info('---PAYMENT.SERVICE.CREATE INIT---');

      // Generate unique reference
      let uniqueReference = false;
      let reference: string;
      while (!uniqueReference) {
        reference = generateAlphanumericCode(10);
        const existingPayment = await this.paymentModel.findOne({ reference });
        if (!existingPayment) {
          uniqueReference = true;
        }
      }

      // Generate payment with automatic paymentDate and reference
      const payment = await this.paymentModel.create({
        ...createPaymentDto,
        paymentDate: new Date(),
        reference,
      });
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

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.paymentModel
          .find()
          .skip(skip)
          .limit(limit)
          .populate({
            path: 'student',
            populate: {
              path: 'class',
              populate: {
                path: 'school',
              },
            },
          }),
        this.paymentModel.countDocuments(),
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
      const payment = await this.paymentModel.findById(id).populate({
        path: 'student',
        populate: {
          path: 'class',
          populate: {
            path: 'school',
          },
        },
      });
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
