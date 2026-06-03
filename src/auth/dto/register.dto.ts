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

  // ── Student-specific fields (wajib jika role = STUDENT) ────────

  @ApiPropertyOptional({ example: '20240001', description: 'Nomor Induk Siswa (otomatis di-generate jika tidak diisi)' })
  @IsString()
  @IsOptional()
  nis?: string;

  @ApiPropertyOptional({ example: 'XI-IPA 2', description: 'Kelas siswa (contoh: X-IPA 1, XI-IPS 2)' })
  @IsString()
  @IsOptional()
  classRoom?: string;

  @ApiPropertyOptional({ example: 'IPA', description: 'Jurusan siswa (contoh: IPA, IPS)' })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiPropertyOptional({ example: 'XI', description: 'Tingkat kelas siswa (contoh: X, XI, XII)' })
  @IsString()
  @IsOptional()
  grade?: string;
}
