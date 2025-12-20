import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import logger from 'src/utils/logger';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { Cycle } from './interfaces/cycle.interface';

@Injectable()
export class CycleService {
  constructor(@InjectModel('Cycle') private cycleModel: Model<Cycle>) {}

  async create(createCycleDto: CreateCycleDto) {
    try {
      logger.info('---CYCLE.SERVICE.CREATE INIT---');
      const cycle = await this.cycleModel.create(createCycleDto);
      logger.info('---CYCLE.SERVICE.CREATE SUCCESS---');
      return cycle;
    } catch (error) {
      logger.error(`---CYCLE.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.cycleModel.find();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const cycle = await this.cycleModel.findById(id);
      if (!cycle) {
        throw new HttpException('Cycle not found', HttpStatus.NOT_FOUND);
      }
      return cycle;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateCycleDto: UpdateCycleDto) {
    try {
      const cycle = await this.cycleModel.findByIdAndUpdate(
        id,
        { ...updateCycleDto, updated_at: new Date() },
        { new: true },
      );
      if (!cycle) {
        throw new HttpException('Cycle not found', HttpStatus.NOT_FOUND);
      }
      return cycle;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const cycle = await this.cycleModel.findByIdAndDelete(id);
      if (!cycle) {
        throw new HttpException('Cycle not found', HttpStatus.NOT_FOUND);
      }
      return cycle;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}


