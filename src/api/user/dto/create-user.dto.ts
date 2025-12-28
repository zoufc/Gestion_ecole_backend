import { IsNotEmpty, IsOptional, ValidateIf, IsMongoId } from 'class-validator';
import { Role } from 'src/utils/enums/roles.enum';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  role?: string;
  @ValidateIf((o) => o.role === Role.Director || o.role === Role.Teacher)
  @IsNotEmpty({ message: 'School is required for Director and Teacher roles' })
  @IsMongoId({ message: 'School must be a valid MongoDB ObjectId' })
  school?: string;
}
