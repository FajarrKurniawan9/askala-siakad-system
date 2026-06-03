import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateStudentOrganizationDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the student to enroll in the organization',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'UUID of the school organization',
  })
  @IsUUID()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty({
    example: 'Chairman',
    description: 'Role or position held by the student within the organization',
  })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the membership is currently active (defaults to true)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
