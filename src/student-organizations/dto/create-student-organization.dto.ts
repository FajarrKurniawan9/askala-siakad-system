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
    description: 'UUID siswa yang akan didaftarkan ke organisasi',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'UUID organisasi sekolah',
  })
  @IsUUID()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty({
    example: 'Ketua',
    description: 'Jabatan atau peran siswa dalam organisasi',
  })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Status keanggotaan siswa (true = aktif, default: true)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
