import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './interfaces/student.interface';
import logger from 'src/utils/logger';
import { generateAlphanumericCode } from 'src/utils/functions/code_generation';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      logger.info('---STUDENT.SERVICE.CREATE INIT---');
      let uniqueCode = false;
      let code: string;
      
      // Generate unique code
      while (!uniqueCode) {
        code = generateAlphanumericCode(8);
        const existingStudent = await this.studentModel.findOne({ code });
        if (!existingStudent) {
          uniqueCode = true;
        }
      }

      const student = await this.studentModel.create({
        ...createStudentDto,
        code,
      });
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

  async findAll() {
    try {
      return await this.studentModel.find().populate(['class']);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const student = await this.studentModel.findById(id).populate(['class']);
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
}
