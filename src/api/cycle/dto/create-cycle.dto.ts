import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCycleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;
}


