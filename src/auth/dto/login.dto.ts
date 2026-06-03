import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'guru@sekolah.ac.id', description: 'Alamat email pengguna untuk login' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Kata sandi akun pengguna' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
