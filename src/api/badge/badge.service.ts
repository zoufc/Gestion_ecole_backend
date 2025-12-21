import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge } from './interfaces/badge.interface';
import logger from 'src/utils/logger';
import { generateAlphanumericCode } from 'src/utils/functions/code_generation';
import { generateQRCode } from 'src/utils/functions/qrcode_generation';
import { Student } from '../student/interfaces/student.interface';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel('Badge') private badgeModel: Model<Badge>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  async create(createBadgeDto: CreateBadgeDto) {
    try {
      logger.info('---BADGE.SERVICE.CREATE INIT---');
      let uniqueCode = false;
      let code: string;

      // Generate unique code
      while (!uniqueCode) {
        code = generateAlphanumericCode(8);
        const existingBadge = await this.badgeModel.findOne({ code });
        if (!existingBadge) {
          uniqueCode = true;
        }
      }

      // Get student information for QR code
      const student = await this.studentModel.findById(createBadgeDto.student);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Prepare data for QR code
      const qrCodeData = {
        studentId: student._id.toString(),
        studentCode: student.code,
        firstName: student.firstName,
        lastName: student.lastName,
        badgeCode: code,
      };

      // Generate QR code
      const qrcode = await generateQRCode(qrCodeData);

      const badge = await this.badgeModel.create({
        ...createBadgeDto,
        code,
        qrcode,
      });
      logger.info('---BADGE.SERVICE.CREATE SUCCESS---');
      return badge;
    } catch (error) {
      logger.error(`---BADGE.SERVICE.CREATE ERROR--- ${error.message}`);
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
        this.badgeModel.find().skip(skip).limit(limit).populate(['student']),
        this.badgeModel.countDocuments(),
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
      const badge = await this.badgeModel.findById(id).populate(['student']);
      if (!badge) {
        throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
      }
      return badge;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByStudent(studentId: string) {
    try {
      const badge = await this.badgeModel
        .findOne({ student: studentId })
        .populate(['student']);
      if (!badge) {
        throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
      }
      return badge;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateBadgeDto: UpdateBadgeDto) {
    try {
      const badge = await this.badgeModel.findByIdAndUpdate(
        id,
        { ...updateBadgeDto, updated_at: new Date() },
        { new: true },
      );
      if (!badge) {
        throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
      }
      return badge;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const badge = await this.badgeModel.findByIdAndDelete(id);
      if (!badge) {
        throw new HttpException('Badge not found', HttpStatus.NOT_FOUND);
      }
      return badge;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}

