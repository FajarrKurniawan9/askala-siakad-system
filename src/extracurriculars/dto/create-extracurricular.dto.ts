import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExtracurricularDto {
  @ApiProperty({
    example: 'Flag Corps (Paskibra)',
    description: 'Name of the extracurricular activity',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Marching drill and flag-raising ceremony practice',
    description: 'Brief description of the extracurricular activity',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Every Wednesday, 3:00 PM',
    description: 'Recurring schedule for practice or meetings',
  })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the student enrolling in this extracurricular',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
