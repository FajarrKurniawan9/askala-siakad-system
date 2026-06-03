import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Extracurricular } from '@prisma/client';

export class ExtracurricularEntity implements Extracurricular {
  @ApiProperty({ example: 'uuid-1234', description: 'ID unik dari database' })
  id!: string;

  @ApiProperty({ example: 'Pramuka', description: 'Nama Ekstrakurikuler' })
  name!: string;

  @ApiPropertyOptional({
    example: 'Kegiatan tali temali',
    description: 'Deskripsi',
  })
  description!: string | null;

  @ApiPropertyOptional({
    example: 'Jumat, 15:00',
    description: 'Jadwal kumpul',
  })
  schedule!: string | null;

  @ApiProperty({ example: true, description: 'Status aktif' })
  isActive!: boolean;

  @ApiProperty({ example: 'uuid-student', description: 'ID Siswa yang ikut' })
  studentId!: string;
}
