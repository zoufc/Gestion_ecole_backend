import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './interfaces/course.interface';
import logger from 'src/utils/logger';

@Injectable()
export class CourseService {
  constructor(@InjectModel('Course') private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      logger.info('---COURSE.SERVICE.CREATE INIT---');
      const course = await this.courseModel.create(createCourseDto);
      logger.info('---COURSE.SERVICE.CREATE SUCCESS---');
      return course;
    } catch (error) {
      logger.error(`---COURSE.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.courseModel.find().populate(['class']);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.courseModel.findById(id).populate(['class']);
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return course;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.courseModel.findByIdAndUpdate(
        id,
        { ...updateCourseDto, updated_at: new Date() },
        { new: true },
      );
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return course;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const course = await this.courseModel.findByIdAndDelete(id);
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return course;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
