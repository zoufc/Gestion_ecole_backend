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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import logger from 'src/utils/logger';
import { Response } from 'express';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Res() res: Response) {
    try {
      logger.info('---NOTE.CONTROLLER.CREATE INIT---');
      const note = await this.noteService.create(createNoteDto);
      logger.info('---NOTE.CONTROLLER.CREATE SUCCESS---');
      return res.status(HttpStatus.CREATED).json(note);
    } catch (error) {
      logger.error(`---NOTE.CONTROLLER.CREATE ERROR--- ${error.message}`);
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
      logger.info('---NOTE.CONTROLLER.FIND_ALL INIT---');
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const result = await this.noteService.findAll(pageNumber, limitNumber);
      logger.info('---NOTE.CONTROLLER.FIND_ALL SUCCESS---');
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error(`---NOTE.CONTROLLER.FIND_ALL ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---NOTE.CONTROLLER.FIND_ONE INIT---');
      const note = await this.noteService.findOne(id);
      logger.info('---NOTE.CONTROLLER.FIND_ONE SUCCESS---');
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      logger.error(`---NOTE.CONTROLLER.FIND_ONE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Res() res: Response,
  ) {
    try {
      logger.info('---NOTE.CONTROLLER.UPDATE INIT---');
      const note = await this.noteService.update(id, updateNoteDto);
      logger.info('---NOTE.CONTROLLER.UPDATE SUCCESS---');
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      logger.error(`---NOTE.CONTROLLER.UPDATE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      logger.info('---NOTE.CONTROLLER.REMOVE INIT---');
      const note = await this.noteService.remove(id);
      logger.info('---NOTE.CONTROLLER.REMOVE SUCCESS---');
      return res.status(HttpStatus.OK).json(note);
    } catch (error) {
      logger.error(`---NOTE.CONTROLLER.REMOVE ERROR--- ${error.message}`);
      return res.status(error.status || HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
