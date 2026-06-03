import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const role = dto.role ?? 'STUDENT';

    // Gunakan transaction agar User + Role Profile dibuat secara atomik
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { ...dto, password: hashed, role },
        select: USER_SELECT,
      });

      // Auto-create role profile sesuai role
      if (role === 'PARENT') {
        await tx.parent.create({ data: { userId: user.id } });
      } else if (role === 'ADMIN') {
        await tx.adminProfile.create({ data: { userId: user.id } });
      }

      return user;
    });
  }

  // ── Find all ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.user.findMany({ select: USER_SELECT });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: number, dto: UpdateUserDto) {
    const currentUser = await this.findOne(id);

    if (dto.email) {
      const conflict = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Email already in use');
    }

    const data: Partial<typeof dto & { password?: string }> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    // Jika role berubah, buat profile baru sesuai role target
    if (dto.role && dto.role !== currentUser.role) {
      if (dto.role === 'PARENT') {
        const existing = await this.prisma.parent.findUnique({ where: { userId: id } });
        if (!existing) {
          await this.prisma.parent.create({ data: { userId: id } });
        }
      } else if (dto.role === 'ADMIN') {
        const existing = await this.prisma.adminProfile.findUnique({ where: { userId: id } });
        if (!existing) {
          await this.prisma.adminProfile.create({ data: { userId: id } });
        }
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: `User #${id} deleted successfully` };
  }
}
