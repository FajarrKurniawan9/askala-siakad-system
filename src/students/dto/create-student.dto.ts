// src/students/dto/create-student.dto.ts
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  nis!: string;

  @IsString()
  @IsNotEmpty()
  classRoom!: string;

  @IsString()
  @IsNotEmpty()
  major!: string;

  @IsString()
  @IsNotEmpty()
  grade!: string;

  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
