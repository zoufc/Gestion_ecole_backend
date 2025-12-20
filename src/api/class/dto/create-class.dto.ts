import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'School must be a valid MongoDB ObjectId' })
  school: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Cycle must be a valid MongoDB ObjectId' })
  cycle: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Teacher must be a valid MongoDB ObjectId' })
  teacher: string;
}
