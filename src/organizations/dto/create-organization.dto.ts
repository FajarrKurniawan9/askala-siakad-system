// src/organizations/dto/create-organization.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'OSIS SMA Negeri 1', description: 'Nama organisasi sekolah' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Organisasi Siswa Intra Sekolah yang mengelola kegiatan kesiswaan', description: 'Deskripsi singkat tentang organisasi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Status aktif organisasi (true = aktif, false = nonaktif)' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
