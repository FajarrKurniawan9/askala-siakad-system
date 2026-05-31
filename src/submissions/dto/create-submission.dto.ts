// src/submissions/dto/create-submission.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  @IsNotEmpty()
  billId!: string;

  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}
