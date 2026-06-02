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
    description: 'Transaction type (income or expense)',
    enum: TxType,
    example: 'IN',
  })
  @IsEnum(TxType)
  @IsNotEmpty()
  type!: TxType;

  @ApiProperty({ description: 'Title of the transaction', example: 'Iuran bulanan Mei 2025' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Amount in IDR (must be positive)', example: 50000 })
  @IsInt()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Date of the transaction (ISO 8601)',
    example: '2025-06-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ description: 'Additional description or notes' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Numeric user ID of the admin who recorded this transaction',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  createdById!: number;

  @ApiProperty({
    description: 'UUID of the school organization this transaction belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  orgId!: string;
}
