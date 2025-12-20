import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Model } from 'mongoose';
import { Note } from './interfaces/note.interface';
import logger from 'src/utils/logger';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NoteService {
  constructor(@InjectModel('Note') private noteModel: Model<Note>) {}
  async create(createNoteDto: CreateNoteDto) {
    try {
      logger.info('---NOTE.SERVICE.CREATE INIT---');
      const note = await this.noteModel.create(createNoteDto);
      logger.info('---NOTE.SERVICE.CREATE SUCCESS---');
      return note;
    } catch (error) {
      logger.error(`---NOTE.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return await this.noteModel.find().populate(['student', 'course']);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const note = await this.noteModel
        .findById(id)
        .populate(['student', 'course']);
      if (!note) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }
      return note;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    try {
      const note = await this.noteModel.findByIdAndUpdate(
        id,
        { ...updateNoteDto, updated_at: new Date() },
        { new: true },
      );
      if (!note) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }
      return note;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const note = await this.noteModel.findByIdAndDelete(id);
      if (!note) {
        throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
      }
      return note;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
