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
import { PaymentTypeService } from './payment-type.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('payment-types')
export class PaymentTypeController {
  constructor(private readonly paymentTypeService: PaymentTypeService) {}

  @Post()
  async create(
    @Body() createPaymentTypeDto: CreatePaymentTypeDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PAYMENT_TYPE.CONTROLLER.CREATE INIT---');
      const paymentType = await this.paymentTypeService.create(
        createPaymentTypeDto,
      );
      logger.info('---PAYMENT_TYPE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(paymentType);
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.CONTROLLER.CREATE ERROR--- ${error.message}`,
      );
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
      logger.info('---PAYMENT_TYPE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.paymentTypeService.findAll(
        pageNumber,
        limitNumber,
      );
      logger.info('---PAYMENT_TYPE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PAYMENT_TYPE.CONTROLLER.FIND_ONE INIT---');
      const paymentType = await this.paymentTypeService.findOne(id);
      logger.info('---PAYMENT_TYPE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(paymentType);
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentTypeDto: UpdatePaymentTypeDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---PAYMENT_TYPE.CONTROLLER.UPDATE INIT---');
      const paymentType = await this.paymentTypeService.update(
        id,
        updatePaymentTypeDto,
      );
      logger.info('---PAYMENT_TYPE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(paymentType);
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.CONTROLLER.UPDATE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---PAYMENT_TYPE.CONTROLLER.REMOVE INIT---');
      const paymentType = await this.paymentTypeService.remove(id);
      logger.info('---PAYMENT_TYPE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(paymentType);
    } catch (error) {
      logger.error(
        `---PAYMENT_TYPE.CONTROLLER.REMOVE ERROR--- ${error.message}`,
      );
      return res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(error);
    }
  }
}
