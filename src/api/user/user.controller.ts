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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
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
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':userId')
  async findOne(@Param('userId') userId: string, @Res() res) {
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
