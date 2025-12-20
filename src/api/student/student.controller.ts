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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---STUDENT.CONTROLLER.CREATE INIT---');
      const student = await this.studentService.create(createStudentDto);
      logger.info('---STUDENT.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(student);
    } catch (error) {
      logger.error(`---STUDENT.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      logger.info('---STUDENT.CONTROLLER.FIND_ALL INIT---');
      const students = await this.studentService.findAll();
      logger.info('---STUDENT.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(students);
    } catch (error) {
      logger.error(`---STUDENT.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---STUDENT.CONTROLLER.FIND_ONE INIT---');
      const student = await this.studentService.findOne(id);
      logger.info('---STUDENT.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(student);
    } catch (error) {
      logger.error(`---STUDENT.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---STUDENT.CONTROLLER.UPDATE INIT---');
      const student = await this.studentService.update(id, updateStudentDto);
      logger.info('---STUDENT.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(student);
    } catch (error) {
      logger.error(`---STUDENT.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---STUDENT.CONTROLLER.REMOVE INIT---');
      const student = await this.studentService.remove(id);
      logger.info('---STUDENT.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(student);
    } catch (error) {
      logger.error(`---STUDENT.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
