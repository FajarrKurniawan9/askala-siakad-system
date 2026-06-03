import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ description: 'Judul kegiatan siswa', example: 'Juara 1 Lomba Debat' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Tipe atau kategori kegiatan',
    example: 'Prestasi',
    enum: ['Prestasi', 'Organisasi', 'Eskul', 'Pembayaran'],
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional({ description: 'Deskripsi detail mengenai kegiatan', example: 'Mengikuti lomba debat antar sekolah tingkat kota' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tanggal kegiatan berlangsung (format ISO 8601). Jika tidak diisi, akan menggunakan waktu saat ini.',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'UUID siswa yang terkait dengan kegiatan ini',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
