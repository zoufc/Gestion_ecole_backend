import { IsNotEmpty, IsOptional, ValidateIf, IsEmail } from 'class-validator';

export class CreateParentAccountDto {
  @ValidateIf((o) => !o.phoneNumber)
  @IsNotEmpty({ message: 'Email or phone number is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty({ message: 'Email or phone number is required' })
  phoneNumber?: string;
}

