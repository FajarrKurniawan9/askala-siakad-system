// src/submissions/dto/update-submission.dto.ts
import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';
import { CreateSubmissionDto } from './create-submission.dto';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {
  @ApiPropertyOptional({ example: 'VERIFIED', description: 'Status verifikasi pembayaran (contoh: PENDING, VERIFIED, REJECTED)', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: 'Bukti pembayaran sudah sesuai', description: 'Catatan dari admin mengenai status pengajuan' })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({ example: 'Admin Keuangan', description: 'Nama atau ID admin yang memverifikasi pengajuan' })
  @IsString()
  @IsOptional()
  verifiedBy?: string;
}
