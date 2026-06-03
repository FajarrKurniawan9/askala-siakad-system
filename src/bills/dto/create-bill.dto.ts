// src/bills/dto/create-bill.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBillDto {
  @ApiProperty({ example: 'SPP Bulan Juni 2025', description: 'Judul atau nama tagihan pembayaran' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 500000, description: 'Jumlah tagihan dalam Rupiah (harus bilangan positif)' })
  @IsInt()
  @IsPositive()
  amount!: number;

  @ApiProperty({ example: '2025-06-30T23:59:59.000Z', description: 'Batas waktu pembayaran (format ISO 8601)' })
  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @ApiPropertyOptional({ example: 'Pembayaran SPP semester genap tahun ajaran 2024/2025', description: 'Keterangan tambahan mengenai tagihan' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID organisasi sekolah terkait tagihan (opsional)' })
  @IsUUID()
  @IsOptional()
  orgId?: string;
}
