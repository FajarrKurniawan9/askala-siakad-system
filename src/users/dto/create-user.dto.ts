// src/users/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin@sekolah.ac.id',
    description: 'Alamat email pengguna (harus unik)',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Kata sandi untuk akun pengguna',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'Siti', description: 'Nama depan pengguna' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Nurhaliza', description: 'Nama belakang pengguna' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({
    example: '081234567890',
    description: 'Nomor telepon pengguna (opsional)',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    description:
      'Peran pengguna dalam sistem SIAKAD (contoh: ADMIN, TEACHER, PARENT, STUDENT)',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
