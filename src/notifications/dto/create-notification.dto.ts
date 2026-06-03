import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Pembayaran SPP bulan Juli Anda telah diverifikasi.',
    description: 'Isi teks notifikasi yang akan ditampilkan kepada pengguna',
  })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Status apakah notifikasi sudah dibaca (default: false)',
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({
    example: 'payment',
    description:
      'Kategori notifikasi (contoh: "payment", "achievement", "info")',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: 1,
    description: 'ID pengguna yang akan menerima notifikasi ini',
  })
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
