import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ description: 'Title of the activity', example: 'Juara 1 Lomba Debat' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Type/category of the activity',
    example: 'Prestasi',
    enum: ['Prestasi', 'Organisasi', 'Eskul', 'Pembayaran'],
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional({ description: 'Detailed description of the activity' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date the activity occurred (ISO 8601). Defaults to now if omitted.',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'UUID of the student this activity belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
