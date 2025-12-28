import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './interfaces/student.interface';
import { Parent } from '../parent/interfaces/parent.interface';
import logger from 'src/utils/logger';
import { generateAlphanumericCode } from 'src/utils/functions/code_generation';
import { BadgeService } from '../badge/badge.service';
import { PromobileSmsService } from '../../providers/promobile-sms.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private studentModel: Model<Student>,
    @InjectModel('Parent') private parentModel: Model<Parent>,
    private badgeService: BadgeService,
    private promobileSmsService: PromobileSmsService,
    private configService: ConfigService,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      logger.info('---STUDENT.SERVICE.CREATE INIT---');

      // Create parent first
      const parentData = {
        firstName: createStudentDto.parentFirstName,
        lastName: createStudentDto.parentLastName,
        email: createStudentDto.parentEmail,
        phoneNumber: createStudentDto.parentPhoneNumber,
        platformAccess: false,
      };
      const parent = await this.parentModel.create(parentData);
      logger.info('---STUDENT.SERVICE.PARENT_CREATED---');

      // Generate unique code for student
      let uniqueCode = false;
      let code: string;
      while (!uniqueCode) {
        code = generateAlphanumericCode(8);
        const existingStudent = await this.studentModel.findOne({ code });
        if (!existingStudent) {
          uniqueCode = true;
        }
      }

      // Create student with parent reference
      const {
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhoneNumber,
        ...studentData
      } = createStudentDto;
      const student = await this.studentModel.create({
        ...studentData,
        parent: parent._id,
        code,
      });

      // Generate badge automatically for the student
      try {
        await this.badgeService.create({
          student: student._id.toString(),
          active: true,
        });
        logger.info('---STUDENT.SERVICE.BADGE_CREATED---');
      } catch (badgeError) {
        logger.error(
          `---STUDENT.SERVICE.BADGE_CREATION_ERROR--- ${badgeError.message}`,
        );
        // Continue even if badge creation fails
      }

      // Send SMS to parent with student details
      try {
        const studentWithDetails = await this.studentModel
          .findById(student._id)
          .populate('parent')
          .populate({
            path: 'class',
            populate: {
              path: 'school',
            },
          });

        if (studentWithDetails && studentWithDetails.parent) {
          const parentData = studentWithDetails.parent as any;
          const smsContent = this.buildSmsContent(studentWithDetails);
          const smsFrom = this.configService.get<string>('promobileSmsFrom');

          const smsResponse = await this.promobileSmsService.sendSms({
            from: smsFrom,
            to: parentData.phoneNumber,
            content: smsContent,
          });
          logger.info(
            `---STUDENT.SERVICE.SMS_SENT_TO_PARENT--- ${smsResponse}`,
          );
        }
      } catch (smsError) {
        logger.error(
          `---STUDENT.SERVICE.SMS_SEND_ERROR--- ${smsError.message}`,
        );
        // Continue even if SMS sending fails
      }

      logger.info('---STUDENT.SERVICE.CREATE SUCCESS---');
      return student;
    } catch (error) {
      logger.error(`---STUDENT.SERVICE.CREATE ERROR--- ${error.message}`);
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
        this.studentModel
          .find()
          .skip(skip)
          .limit(limit)
          .populate('parent')
          .populate({
            path: 'class',
            populate: {
              path: 'school',
            },
          }),
        this.studentModel.countDocuments(),
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
      const student = await this.studentModel
        .findById(id)
        .populate('parent')
        .populate({
          path: 'class',
          populate: {
            path: 'school',
          },
        });
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return student;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentModel.findByIdAndUpdate(
        id,
        { ...updateStudentDto, updated_at: new Date() },
        { new: true },
      );
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return student;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const student = await this.studentModel.findByIdAndDelete(id);
      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return student;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  private buildSmsContent(student: any): string {
    const studentName = `${student.firstName} ${student.lastName}`;
    const studentCode = student.code;
    const className = student.class?.name || 'N/A';
    const schoolName = student.class?.school?.name || 'N/A';
    const parentFullName = student.parent
      ? `${student.parent.firstName} ${student.parent.lastName}`
      : 'Parent';

    return `Bonjour ${parentFullName},\n\nVotre enfant ${studentName} a été inscrit(e) avec succès à l'école.\n\nDétails de l'inscription:\n- Code étudiant: ${studentCode}\n- Classe: ${className}\n- École: ${schoolName}\n\nMerci de votre confiance.`;
  }
}
