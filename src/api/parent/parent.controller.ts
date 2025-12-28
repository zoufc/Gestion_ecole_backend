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
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateParentAccountDto } from './dto/create-parent-account.dto';
import { ParentService } from './parent.service';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  async create(@Body() createParentDto: CreateParentDto, @Res() res: Response) {
    try {
      logger.info('---PARENT.CONTROLLER.CREATE INIT---');
      const parent = await this.parentService.create(createParentDto);
      logger.info('---PARENT.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(parent);
    } catch (error) {
      logger.error(`---PARENT.CONTROLLER.CREATE ERROR--- ${error.message}`);
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
      logger.info('---PARENT.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.parentService.findAll(pageNumber, limitNumber);
      logger.info('---PARENT.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---PARENT.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post(':id/create-account')
  async createAccount(
    @Param('id') id: string,
    @Body() createAccountDto: CreateParentAccountDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PARENT.CONTROLLER.CREATE_ACCOUNT INIT---');
      const parent = await this.parentService.createAccount(
        id,
        createAccountDto,
      );
      logger.info('---PARENT.CONTROLLER.CREATE_ACCOUNT SUCCESS---');
      return res.status(HttpStatus.CREATED).json(parent);
    } catch (error) {
      logger.error(
        `---PARENT.CONTROLLER.CREATE_ACCOUNT ERROR--- ${error.message}`,
      );
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PARENT.CONTROLLER.FIND_ONE INIT---');
      const parent = await this.parentService.findOne(id);
      logger.info('---PARENT.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(parent);
    } catch (error) {
      logger.error(`---PARENT.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: UpdateParentDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PARENT.CONTROLLER.UPDATE INIT---');
      const parent = await this.parentService.update(id, updateParentDto);
      logger.info('---PARENT.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(parent);
    } catch (error) {
      logger.error(`---PARENT.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PARENT.CONTROLLER.REMOVE INIT---');
      const parent = await this.parentService.remove(id);
      logger.info('---PARENT.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(parent);
    } catch (error) {
      logger.error(`---PARENT.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
