import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsEmail,
} from 'class-validator';

export class CreateParentDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  platformAccess?: boolean;

  @IsOptional()
  @IsMongoId({ message: 'User must be a valid MongoDB ObjectId' })
  userId?: string;
}
