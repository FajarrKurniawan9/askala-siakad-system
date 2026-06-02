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
    example: 'uuid-student-di-sini',
    description: 'ID Siswa (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({
    example: 'uuid-org-di-sini',
    description: 'ID Organisasi Sekolah (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty({ example: 'Chairman', description: 'Jabatan di organisasi' })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Status aktif di organisasi',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
