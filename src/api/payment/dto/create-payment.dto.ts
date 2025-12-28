import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsEnum,
  IsString,
  IsOptional,
  Max,
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

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Reduction percentage must be at least 0' })
  @Max(100, { message: 'Reduction percentage must be at most 100' })
  reductionPercentage?: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNotEmpty()
  @IsMongoId({ message: 'PaymentType must be a valid MongoDB ObjectId' })
  paymentType: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
