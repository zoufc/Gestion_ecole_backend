import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from './interfaces/class.interface';
import logger from 'src/utils/logger';

@Injectable()
export class ClassService {
  constructor(@InjectModel('Class') private classModel: Model<Class>) {}

  async create(createClassDto: CreateClassDto) {
    try {
      logger.info('---CLASS.SERVICE.CREATE INIT---');
      const createdClass = await this.classModel.create(createClassDto);
      logger.info('---CLASS.SERVICE.CREATE SUCCESS---');
      return createdClass;
    } catch (error) {
      logger.error(`---CLASS.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.classModel
        .find()
        .populate(['school', 'cycle', 'teacher']);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const foundClass = await this.classModel
        .findById(id)
        .populate(['school', 'cycle', 'teacher']);
      if (!foundClass) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }
      return foundClass;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    try {
      const updated = await this.classModel.findByIdAndUpdate(
        id,
        { ...updateClassDto, updated_at: new Date() },
        { new: true },
      );
      if (!updated) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.classModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }
      return deleted;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
