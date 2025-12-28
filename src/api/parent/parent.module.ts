import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { ParentSchema } from './schemas/parent.schema';
import { StudentSchema } from '../student/schemas/student.schema';
import { UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Parent', schema: ParentSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ParentController],
  providers: [ParentService],
  exports: [ParentService],
})
export class ParentModule {}

