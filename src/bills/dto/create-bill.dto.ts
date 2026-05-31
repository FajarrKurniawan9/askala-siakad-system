// src/bills/dto/create-bill.dto.ts
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
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  orgId?: string;
}
