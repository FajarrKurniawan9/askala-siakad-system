import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'guru@sekolah.ac.id', description: 'Alamat email untuk pendaftaran akun baru' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Kata sandi untuk akun baru (minimal 8 karakter)' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'Budi', description: 'Nama depan pengguna' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Santoso', description: 'Nama belakang pengguna' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Nomor telepon pengguna (opsional)' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'TEACHER', description: 'Peran pengguna dalam sistem (contoh: ADMIN, TEACHER, PARENT, STUDENT)', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
