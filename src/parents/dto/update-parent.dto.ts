// src/parents/dto/update-parent.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateParentDto {
  @ApiPropertyOptional({
    description: 'Reassign this Parent profile to a different User ID',
    example: 55,
  })
  @IsInt()
  @IsOptional()
  userId?: number;
}
