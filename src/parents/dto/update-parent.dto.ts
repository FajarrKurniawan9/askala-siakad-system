// src/parents/dto/update-parent.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateParentDto {
  @ApiPropertyOptional({
    description: 'Pindahkan profil Orang Tua/Wali ini ke ID pengguna lain',
    example: 55,
  })
  @IsInt()
  @IsOptional()
  userId?: number;
}
