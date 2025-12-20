import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(
    @Body() createSchoolDto: CreateSchoolDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---SCHOOL.CONTROLLER.CREATE INIT---');
      const school = await this.schoolService.create(createSchoolDto);
      logger.info('---SCHOOL.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(school);
    } catch (error) {
      logger.error(`---SCHOOL.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      logger.info('---SCHOOL.CONTROLLER.FIND_ALL INIT---');
      const schools = await this.schoolService.findAll();
      logger.info('---SCHOOL.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(schools);
    } catch (error) {
      logger.error(`---SCHOOL.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---SCHOOL.CONTROLLER.FIND_ONE INIT---');
      const school = await this.schoolService.findOne(id);
      logger.info('---SCHOOL.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(school);
    } catch (error) {
      logger.error(`---SCHOOL.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---SCHOOL.CONTROLLER.UPDATE INIT---');
      const school = await this.schoolService.update(id, updateSchoolDto);
      logger.info('---SCHOOL.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(school);
    } catch (error) {
      logger.error(`---SCHOOL.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---SCHOOL.CONTROLLER.REMOVE INIT---');
      const school = await this.schoolService.remove(id);
      logger.info('---SCHOOL.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(school);
    } catch (error) {
      logger.error(`---SCHOOL.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
