import {
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { GenderEnum } from 'src/utils/enums/genders.enum';

export class CreateStudentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsNotEmpty()
  @IsMongoId({ message: 'Class must be a valid MongoDB ObjectId' })
  class: string;

  @IsNotEmpty()
  parentFullName: string;

  @IsOptional()
  parentEmail?: string;

  @IsNotEmpty()
  parentPhoneNumber: string;
}
