// src/achievements/dto/update-achievement.dto.ts
import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAchievementDto } from './create-achievement.dto';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {
  @ApiPropertyOptional({ example: true, description: 'Status verifikasi prestasi oleh admin (true = sudah diverifikasi)' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
