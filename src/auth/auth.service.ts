import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? 'STUDENT';

    // Gunakan transaction agar User + Role Profile dibuat secara atomik
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashed,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role,
        },
      });

      // Auto-create role profile sesuai role
      if (role === 'PARENT') {
        await tx.parent.create({ data: { userId: user.id } });
      } else if (role === 'ADMIN') {
        await tx.adminProfile.create({ data: { userId: user.id } });
      }
      // STUDENT: tidak auto-create karena butuh nis, classRoom, major, grade
      // TEACHER: tidak ada tabel profil terpisah di schema

      return user;
    });

    return {
      message: 'Registration successful',
      userId: result.id,
      role: result.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { access_token: token };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: { select: { id: true, nis: true, classRoom: true, grade: true, major: true } },
        parentProfile: { select: { id: true } },
        adminProfile: { select: { id: true } },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    return {
      userId: user.id,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      studentId: user.studentProfile?.id ?? null,
      studentProfile: user.studentProfile ?? null,
      parentId: user.parentProfile?.id ?? null,
      adminProfileId: user.adminProfile?.id ?? null,
    };
  }
}
