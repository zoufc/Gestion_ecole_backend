import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
import { PaymentMethod } from '../../../utils/enums/payment_method.enum';
import { PaymentStatus } from '../../../utils/enums/payment_status.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Student must be a valid MongoDB ObjectId' })
  student: string;

  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Amount must be positive' })
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
