// src/parents/dto/create-parent.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateParentDto {
  @ApiProperty({
    description: 'The ID of the User account to link as a Parent profile',
    example: 42,
  })
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
