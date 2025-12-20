import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';
import { CycleSchema } from './schemas/cycle.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cycle', schema: CycleSchema }])],
  controllers: [CycleController],
  providers: [CycleService],
})
export class CycleModule {}


