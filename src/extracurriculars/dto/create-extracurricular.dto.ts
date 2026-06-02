import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExtracurricularDto {
  @ApiProperty({ example: 'Paskibra', description: 'Nama Ekstrakurikuler' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Kegiatan baris berbaris dan pengibaran bendera',
    description: 'Deskripsi ekskul',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Setiap Rabu, 15:00 WIB',
    description: 'Jadwal kumpul/latihan',
  })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({
    description: 'UUID of the student enrolling in this extracurricular',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}

