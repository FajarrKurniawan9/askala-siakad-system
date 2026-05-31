// src/achievements/dto/create-achievement.dto.ts
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AchievementType, AchievementLevel } from '@prisma/client';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(AchievementType)
  @IsOptional()
  type?: AchievementType;

  @IsEnum(AchievementLevel)
  @IsOptional()
  level?: AchievementLevel;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  certUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
