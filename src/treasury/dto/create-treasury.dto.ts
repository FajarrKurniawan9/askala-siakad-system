import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TxType } from '@prisma/client';

export class CreateTreasuryDto {
  @ApiProperty({
    description: 'Jenis transaksi (pemasukan atau pengeluaran)',
    enum: TxType,
    example: 'IN',
  })
  @IsEnum(TxType)
  @IsNotEmpty()
  type!: TxType;

  @ApiProperty({ description: 'Judul transaksi keuangan', example: 'Iuran bulanan Mei 2025' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Jumlah dalam Rupiah (harus bilangan positif)', example: 50000 })
  @IsInt()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Tanggal transaksi (format ISO 8601)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ description: 'Keterangan atau catatan tambahan mengenai transaksi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID pengguna (admin) yang mencatat transaksi ini',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  createdById!: number;

  @ApiProperty({
    description: 'UUID organisasi sekolah terkait transaksi ini',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  orgId!: string;
}
