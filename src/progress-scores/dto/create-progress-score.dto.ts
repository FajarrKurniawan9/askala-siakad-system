import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgressScoreDto {
  @ApiProperty({ description: 'Month (1–12)', example: 6, minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @ApiProperty({ description: 'Year', example: 2025 })
  @IsInt()
  @IsNotEmpty()
  year!: number;

  @ApiProperty({
    description: 'Activity score (0–100)',
    example: 85.5,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @ApiProperty({
    description: 'UUID of the student this score belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
