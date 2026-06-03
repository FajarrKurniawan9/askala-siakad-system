// src/students/dto/create-student.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: '2024001',
    description: 'Nomor Induk Siswa (NIS) yang unik',
  })
  @IsString()
  @IsNotEmpty()
  nis!: string;

  @ApiProperty({
    example: 'XII-IPA-1',
    description: 'Nama kelas siswa saat ini',
  })
  @IsString()
  @IsNotEmpty()
  classRoom!: string;

  @ApiProperty({
    example: 'IPA',
    description: 'Jurusan atau peminatan siswa (contoh: IPA, IPS, Bahasa)',
  })
  @IsString()
  @IsNotEmpty()
  major!: string;

  @ApiProperty({
    example: '12',
    description: 'Tingkat atau jenjang kelas siswa (contoh: 10, 11, 12)',
  })
  @IsString()
  @IsNotEmpty()
  grade!: string;

  @ApiProperty({
    example: 42,
    description: 'ID akun pengguna (user) yang terhubung dengan data siswa',
  })
  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID orang tua/wali yang terhubung dengan siswa (opsional)',
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Status keaktifan siswa (true = aktif, false = nonaktif)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
