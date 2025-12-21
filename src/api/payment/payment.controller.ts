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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PAYMENT.CONTROLLER.CREATE INIT---');
      const payment = await this.paymentService.create(createPaymentDto);
      logger.info('---PAYMENT.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(payment);
    } catch (error) {
      logger.error(`---PAYMENT.CONTROLLER.CREATE ERROR--- ${error.message}`);
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
      logger.info('---PAYMENT.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.paymentService.findAll(pageNumber, limitNumber);
      logger.info('---PAYMENT.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---PAYMENT.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PAYMENT.CONTROLLER.FIND_ONE INIT---');
      const payment = await this.paymentService.findOne(id);
      logger.info('---PAYMENT.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(payment);
    } catch (error) {
      logger.error(`---PAYMENT.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PAYMENT.CONTROLLER.UPDATE INIT---');
      const payment = await this.paymentService.update(id, updatePaymentDto);
      logger.info('---PAYMENT.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(payment);
    } catch (error) {
      logger.error(`---PAYMENT.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PAYMENT.CONTROLLER.REMOVE INIT---');
      const payment = await this.paymentService.remove(id);
      logger.info('---PAYMENT.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(payment);
    } catch (error) {
      logger.error(`---PAYMENT.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
