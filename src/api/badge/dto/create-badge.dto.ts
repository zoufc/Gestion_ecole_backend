import { IsNotEmpty, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class CreateBadgeDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Student must be a valid MongoDB ObjectId' })
  student: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

