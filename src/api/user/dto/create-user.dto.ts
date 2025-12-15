import { IsNotEmpty, IsOptional } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  phoneNumber: string;
  @IsOptional()
  email: string;
  @IsOptional()
  codePin: string;
}
