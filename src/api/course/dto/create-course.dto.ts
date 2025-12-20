import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Class must be a valid MongoDB ObjectId' })
  class: string;
}
