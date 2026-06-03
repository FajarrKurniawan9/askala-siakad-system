// src/achievements/dto/create-achievement.dto.ts
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AchievementType, AchievementLevel } from '@prisma/client';

export class CreateAchievementDto {
  @ApiProperty({ example: 'Juara 1 Olimpiade Matematika', description: 'Judul atau nama prestasi siswa' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'ACADEMIC', description: 'Jenis prestasi (contoh: ACADEMIC, NON_ACADEMIC)', enum: AchievementType })
  @IsEnum(AchievementType)
  @IsOptional()
  type?: AchievementType;

  @ApiPropertyOptional({ example: 'NATIONAL', description: 'Tingkat prestasi (contoh: SCHOOL, CITY, PROVINCE, NATIONAL, INTERNATIONAL)', enum: AchievementLevel })
  @IsEnum(AchievementLevel)
  @IsOptional()
  level?: AchievementLevel;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z', description: 'Tanggal prestasi diraih (format ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 'Meraih medali emas pada ajang olimpiade tingkat nasional', description: 'Deskripsi atau keterangan tambahan tentang prestasi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/sertifikat/cert-001.pdf', description: 'URL file sertifikat atau bukti prestasi' })
  @IsString()
  @IsOptional()
  certificateUrl?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID siswa yang meraih prestasi' })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty({ example: 'Juara 1', description: 'Posisi atau peringkat yang diraih' })
  @IsString()
  @IsNotEmpty()
  position!: string;

  @ApiProperty({ example: 'Kementerian Pendidikan RI', description: 'Nama penyelenggara atau institusi yang mengadakan' })
  @IsString()
  @IsNotEmpty()
  organizer!: string;
}
