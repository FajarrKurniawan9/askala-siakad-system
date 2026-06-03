// src/submissions/dto/create-submission.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID tagihan yang akan dibayar' })
  @IsUUID()
  @IsNotEmpty()
  billId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID siswa yang melakukan pengajuan pembayaran' })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/bukti/transfer-001.jpg', description: 'URL file bukti pembayaran yang diunggah (opsional)' })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
