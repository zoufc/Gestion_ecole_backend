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
import { Response } from 'express';
import logger from 'src/utils/logger';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { CycleService } from './cycle.service';

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @Post()
  async create(@Body() createCycleDto: CreateCycleDto, @Res() res: Response) {
    try {
      logger.info('---CYCLE.CONTROLLER.CREATE INIT---');
      const cycle = await this.cycleService.create(createCycleDto);
      logger.info('---CYCLE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(cycle);
    } catch (error) {
      logger.error(`---CYCLE.CONTROLLER.CREATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      logger.info('---CYCLE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.cycleService.findAll(pageNumber, limitNumber);
      logger.info('---CYCLE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---CYCLE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---CYCLE.CONTROLLER.FIND_ONE INIT---');
      const cycle = await this.cycleService.findOne(id);
      logger.info('---CYCLE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(cycle);
    } catch (error) {
      logger.error(`---CYCLE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---CYCLE.CONTROLLER.UPDATE INIT---');
      const cycle = await this.cycleService.update(id, updateCycleDto);
      logger.info('---CYCLE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(cycle);
    } catch (error) {
      logger.error(`---CYCLE.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---CYCLE.CONTROLLER.REMOVE INIT---');
      const cycle = await this.cycleService.remove(id);
      logger.info('---CYCLE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(cycle);
    } catch (error) {
      logger.error(`---CYCLE.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}


