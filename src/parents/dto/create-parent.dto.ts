// src/parents/dto/create-parent.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateParentDto {
  @ApiProperty({
    description: 'ID akun pengguna (user) yang akan dihubungkan sebagai profil Orang Tua/Wali',
    example: 42,
  })
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
