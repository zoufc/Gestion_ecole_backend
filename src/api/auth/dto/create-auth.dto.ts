import { IsNotEmpty } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateAuthDto {
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  password: string;
}
