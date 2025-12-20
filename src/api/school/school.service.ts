import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Model } from 'mongoose';
import { School } from './interfaces/school.interface';
import logger from 'src/utils/logger';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SchoolService {
  constructor(@InjectModel('School') private schoolModel: Model<School>) {}
  async create(createSchoolDto: CreateSchoolDto) {
    try {
      logger.info('---SCHOOL.SERVICE.CREATE INIT---');
      const school = await this.schoolModel.create(createSchoolDto);
      logger.info('---SCHOOL.SERVICE.CREATE SUCCESS---');
      return school;
    } catch (error) {
      logger.error(`---SCHOOL.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.schoolModel.find();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const school = await this.schoolModel.findById(id);
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }
      return school;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    try {
      const school = await this.schoolModel.findByIdAndUpdate(
        id,
        { ...updateSchoolDto, updated_at: new Date() },
        { new: true },
      );
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }
      return school;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const school = await this.schoolModel.findByIdAndDelete(id);
      if (!school) {
        throw new HttpException('School not found', HttpStatus.NOT_FOUND);
      }
      return school;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
