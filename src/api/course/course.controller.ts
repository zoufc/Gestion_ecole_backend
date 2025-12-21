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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto, @Res() res: Response) {
    try {
      logger.info('---COURSE.CONTROLLER.CREATE INIT---');
      const course = await this.courseService.create(createCourseDto);
      logger.info('---COURSE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(course);
    } catch (error) {
      logger.error(`---COURSE.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      logger.info('---COURSE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.courseService.findAll(pageNumber, limitNumber);
      logger.info('---COURSE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---COURSE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---COURSE.CONTROLLER.FIND_ONE INIT---');
      const course = await this.courseService.findOne(id);
      logger.info('---COURSE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      logger.error(`---COURSE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---COURSE.CONTROLLER.UPDATE INIT---');
      const course = await this.courseService.update(id, updateCourseDto);
      logger.info('---COURSE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      logger.error(`---COURSE.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---COURSE.CONTROLLER.REMOVE INIT---');
      const course = await this.courseService.remove(id);
      logger.info('---COURSE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      logger.error(`---COURSE.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
