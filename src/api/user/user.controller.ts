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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import logger from 'src/utils/logger';
import { Roles } from 'src/utils/decorators/role.decorator';
import { Role } from 'src/utils/enums/roles.enum';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      logger.info(`---USER.CONTROLLER.CREATE INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---USER.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.CREATE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      logger.info(`---USER.CONTROLLER.FIND_ALL INIT---`);
      const users = await this.userService.findAll();
      logger.info(`---USER.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Roles(Role.Admin)
  @Get(':userId')
  async findOne(@Param('userId') userId: string, @Res() res: Response) {
    try {
      logger.info(`---USER.CONTROLLER.FIND_ONE INIT---`);
      const user = await this.userService.findOne(userId);
      logger.info(`---USER.CONTROLLER.FIND_ONE SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.FIND_ONE ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      logger.info(`---USER.CONTROLLER.UPDATE INIT---`);
      const user = await this.userService.update(id, updateUserDto);
      logger.info(`---USER.CONTROLLER.UPDATE SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.UPDATE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info(`---USER.CONTROLLER.REMOVE INIT---`);
      const user = await this.userService.remove(id);
      logger.info(`---USER.CONTROLLER.REMOVE SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.REMOVE ERROR ${error}---`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
