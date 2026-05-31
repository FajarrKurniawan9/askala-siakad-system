// src/achievements/dto/update-achievement.dto.ts
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAchievementDto } from './create-achievement.dto';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
