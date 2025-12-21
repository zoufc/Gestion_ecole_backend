import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeSchema } from './schemas/badge.schema';
import { StudentSchema } from '../student/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Badge', schema: BadgeSchema },
      { name: 'Student', schema: StudentSchema },
    ]),
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports: [BadgeService],
})
export class BadgeModule {}

