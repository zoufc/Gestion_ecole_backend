import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schemas/student.schema';
import { BadgeModule } from '../badge/badge.module';
import { PromobileSmsModule } from '../../providers/promobile-sms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    BadgeModule,
    PromobileSmsModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
