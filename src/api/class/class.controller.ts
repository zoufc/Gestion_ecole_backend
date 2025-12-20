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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  async create(
    @Body() createClassDto: CreateClassDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---CLASS.CONTROLLER.CREATE INIT---');
      const createdClass = await this.classService.create(createClassDto);
      logger.info('---CLASS.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(createdClass);
    } catch (error) {
      logger.error(`---CLASS.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      logger.info('---CLASS.CONTROLLER.FIND_ALL INIT---');
      const classes = await this.classService.findAll();
      logger.info('---CLASS.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(classes);
    } catch (error) {
      logger.error(`---CLASS.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---CLASS.CONTROLLER.FIND_ONE INIT---');
      const foundClass = await this.classService.findOne(id);
      logger.info('---CLASS.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(foundClass);
    } catch (error) {
      logger.error(`---CLASS.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---CLASS.CONTROLLER.UPDATE INIT---');
      const updated = await this.classService.update(id, updateClassDto);
      logger.info('---CLASS.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(updated);
    } catch (error) {
      logger.error(`---CLASS.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---CLASS.CONTROLLER.REMOVE INIT---');
      const removed = await this.classService.remove(id);
      logger.info('---CLASS.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(removed);
    } catch (error) {
      logger.error(`---CLASS.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
