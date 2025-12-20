import { IsNotEmpty, IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Student must be a valid MongoDB ObjectId' })
  student: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Course must be a valid MongoDB ObjectId' })
  course: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Note must be at least 0' })
  @Max(20, { message: 'Note must be at most 20' })
  note: number;
}
