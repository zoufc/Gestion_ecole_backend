import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreatePaymentTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Amount must be positive' })
  amount: number;

  @IsOptional()
  @IsString()
  description: string;
}
