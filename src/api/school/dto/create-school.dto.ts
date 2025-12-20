import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateSchoolDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  address?: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Director must be a valid MongoDB ObjectId' })
  director: string;
}
