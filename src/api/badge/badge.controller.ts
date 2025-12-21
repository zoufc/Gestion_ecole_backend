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
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto, @Res() res: Response) {
    try {
      logger.info('---BADGE.CONTROLLER.CREATE INIT---');
      const badge = await this.badgeService.create(createBadgeDto);
      logger.info('---BADGE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(badge);
    } catch (error) {
      logger.error(`---BADGE.CONTROLLER.CREATE ERROR--- ${error.message}`);
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
      logger.info('---BADGE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.badgeService.findAll(pageNumber, limitNumber);
      logger.info('---BADGE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---BADGE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---BADGE.CONTROLLER.FIND_ONE INIT---');
      const badge = await this.badgeService.findOne(id);
      logger.info('---BADGE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(badge);
    } catch (error) {
      logger.error(`---BADGE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('student/:studentId')
  async findByStudent(
    @Param('studentId') studentId: string,
    @Res() res: Response,
  ) {
    try {
      logger.info('---BADGE.CONTROLLER.FIND_BY_STUDENT INIT---');
      const badge = await this.badgeService.findByStudent(studentId);
      logger.info('---BADGE.CONTROLLER.FIND_BY_STUDENT SUCCESS---');
      return res.status(HttpStatus.OK).json(badge);
    } catch (error) {
      logger.error(
        `---BADGE.CONTROLLER.FIND_BY_STUDENT ERROR--- ${error.message}`,
      );
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBadgeDto: UpdateBadgeDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---BADGE.CONTROLLER.UPDATE INIT---');
      const badge = await this.badgeService.update(id, updateBadgeDto);
      logger.info('---BADGE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(badge);
    } catch (error) {
      logger.error(`---BADGE.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---BADGE.CONTROLLER.REMOVE INIT---');
      const badge = await this.badgeService.remove(id);
      logger.info('---BADGE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(badge);
    } catch (error) {
      logger.error(`---BADGE.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }
}

