import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExtracurricularDto {
  @ApiProperty({
    example: 'Paskibra (Flag Corps)',
    description: 'Nama kegiatan ekstrakurikuler',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Latihan baris-berbaris dan upacara pengibaran bendera',
    description: 'Deskripsi singkat mengenai ekstrakurikuler',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'Setiap Rabu, pukul 15:00 WIB',
    description: 'Jadwal rutin latihan atau pertemuan ekstrakurikuler',
  })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID siswa yang mendaftar ekstrakurikuler ini',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;
}
