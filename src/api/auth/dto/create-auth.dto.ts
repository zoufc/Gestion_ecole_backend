import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateAuthDto {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Phone number or email is required' })
  phoneNumber?: string;

  @ValidateIf((o) => !o.phoneNumber)
  @IsNotEmpty({ message: 'Phone number or email is required' })
  email?: string;

  @IsNotEmpty()
  password: string;
}
