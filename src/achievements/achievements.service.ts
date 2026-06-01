import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

const ACHIEVEMENT_INCLUDE = {
  student: {
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  },
} satisfies Prisma.AchievementInclude;

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateAchievementDto) {
    try {
      return await this.prisma.achievement.create({
        data: {
          title: dto.title,
          type: dto.type,
          level: dto.level,
          date: new Date(dto.date),
          description: dto.description,
          certUrl: dto.certUrl,
          studentId: dto.studentId,
        },
        include: ACHIEVEMENT_INCLUDE,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new NotFoundException(`Student #${dto.studentId} not found`);
      }
      throw err;
    }
  }

  // ── Find all ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.achievement.findMany({
      include: ACHIEVEMENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
      include: ACHIEVEMENT_INCLUDE,
    });
    if (!achievement)
      throw new NotFoundException(`Achievement #${id} not found`);
    return achievement;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateAchievementDto) {
    await this.findOne(id);
    return this.prisma.achievement.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.type && { type: dto.type }),
        ...(dto.level && { level: dto.level }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.certUrl !== undefined && { certUrl: dto.certUrl }),
        ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
      },
      include: ACHIEVEMENT_INCLUDE,
    });
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.achievement.delete({ where: { id } });
    return { message: `Achievement #${id} deleted successfully` };
  }
}
