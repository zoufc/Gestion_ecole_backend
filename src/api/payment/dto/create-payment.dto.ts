import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Amount must be positive' })
  amount: number;

  @IsNotEmpty()
  @IsMongoId({ message: 'Student must be a valid MongoDB ObjectId' })
  student: string;
}
