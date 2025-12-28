import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Model } from 'mongoose';
import { Payment } from './interfaces/payment.interface';
import { PaymentType } from '../payment-type/interfaces/payment-type.interface';
import { Student } from '../student/interfaces/student.interface';
import logger from 'src/utils/logger';
import { InjectModel } from '@nestjs/mongoose';
import { generateAlphanumericCode } from 'src/utils/functions/code_generation';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('PaymentType') private paymentTypeModel: Model<PaymentType>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      logger.info('---PAYMENT.SERVICE.CREATE INIT---');

      // Get paymentType to retrieve amount
      const paymentType = await this.paymentTypeModel.findById(
        createPaymentDto.paymentType,
      );
      if (!paymentType) {
        throw new HttpException('PaymentType not found', HttpStatus.NOT_FOUND);
      }

      // Calculate totalAmount based on paymentType.amount and reductionPercentage
      const reductionPercentage = createPaymentDto.reductionPercentage || 0;
      const totalAmount = paymentType.amount * (1 - reductionPercentage / 100);

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

      // Generate payment with automatic paymentDate, reference, and totalAmount
      const payment = await this.paymentModel.create({
        ...createPaymentDto,
        paymentDate: new Date(),
        reference,
        totalAmount,
        reductionPercentage: reductionPercentage || 0,
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

  async findAll(filters?: any, page: number = 1, limit: number = 10) {
    try {
      const baseFilters: any = {};
      let searchConditions: any = null;

      if (filters) {
        if (filters.paymentType) {
          baseFilters.paymentType = filters.paymentType;
        }
        if (filters.status) {
          baseFilters.status = filters.status;
        }
        if (filters.method) {
          baseFilters.method = filters.method;
        }
        if (filters.student) {
          baseFilters.student = filters.student;
        }
        if (filters.month) {
          baseFilters.month = filters.month;
        }
        if (filters.reference) {
          baseFilters.reference = filters.reference;
        }

        // Search by student name or payment reference
        if (filters.search) {
          const searchRegex = new RegExp(filters.search, 'i'); // Case-insensitive

          // Search for students matching firstName or lastName
          const matchingStudents = await this.studentModel
            .find({
              $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
            })
            .select('_id')
            .lean();

          const studentIds = matchingStudents.map((s) => s._id);

          // Build search query: match student IDs OR reference
          const conditions: any[] = [];
          if (studentIds.length > 0) {
            conditions.push({ student: { $in: studentIds } });
          }
          conditions.push({ reference: searchRegex });
          searchConditions = { $or: conditions };
        }
      }

      // Combine base filters with search conditions
      const filterQuery: any = { ...baseFilters };
      if (searchConditions) {
        if (Object.keys(baseFilters).length > 0) {
          // If we have both base filters and search, combine with $and
          filterQuery.$and = [{ ...baseFilters }, searchConditions];
          // Remove individual keys since they're in $and now
          Object.keys(baseFilters).forEach((key) => {
            delete filterQuery[key];
          });
        } else {
          // Only search, use it directly
          Object.assign(filterQuery, searchConditions);
        }
      }

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.paymentModel
          .find(filterQuery)
          .skip(skip)
          .limit(limit)
          .populate('paymentType')
          .populate({
            path: 'student',
            populate: {
              path: 'class',
              populate: {
                path: 'school',
              },
            },
          }),
        this.paymentModel.countDocuments(filterQuery),
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
      const payment = await this.paymentModel
        .findById(id)
        .populate('paymentType')
        .populate({
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
      // Get existing payment to check if paymentType or reductionPercentage changed
      const existingPayment = await this.paymentModel.findById(id);
      if (!existingPayment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }

      // Determine which paymentType to use (updated or existing)
      const paymentTypeId =
        updatePaymentDto.paymentType || existingPayment.paymentType;
      const paymentType = await this.paymentTypeModel.findById(paymentTypeId);
      if (!paymentType) {
        throw new HttpException('PaymentType not found', HttpStatus.NOT_FOUND);
      }

      // Calculate totalAmount if paymentType or reductionPercentage changed
      const reductionPercentage =
        updatePaymentDto.reductionPercentage !== undefined
          ? updatePaymentDto.reductionPercentage
          : existingPayment.reductionPercentage || 0;
      const totalAmount = paymentType.amount * (1 - reductionPercentage / 100);

      // Update payment with calculated totalAmount
      const payment = await this.paymentModel.findByIdAndUpdate(
        id,
        {
          ...updatePaymentDto,
          totalAmount,
          reductionPercentage: reductionPercentage || 0,
          updated_at: new Date(),
        },
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
