import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProgressScoreDto } from './dto/create-progress-score.dto';
import { UpdateProgressScoreDto } from './dto/update-progress-score.dto';

const SCORE_INCLUDE = {
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
} satisfies Prisma.ProgressScoreInclude;

@Injectable()
export class ProgressScoresService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create (upsert on unique constraint) ───────────────────────────────────

  async create(dto: CreateProgressScoreDto) {
    try {
      return await this.prisma.progressScore.upsert({
        where: {
          studentId_month_year: {
            studentId: dto.studentId,
            month: dto.month,
            year: dto.year,
          },
        },
        update: { score: dto.score },
        create: {
          month: dto.month,
          year: dto.year,
          score: dto.score,
          studentId: dto.studentId,
        },
        include: SCORE_INCLUDE,
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

  async findAll(studentId?: string) {
    return this.prisma.progressScore.findMany({
      where: studentId ? { studentId } : undefined,
      include: SCORE_INCLUDE,
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const score = await this.prisma.progressScore.findUnique({
      where: { id },
      include: SCORE_INCLUDE,
    });
    if (!score)
      throw new NotFoundException(`Progress score #${id} not found`);
    return score;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateProgressScoreDto) {
    await this.findOne(id);
    return this.prisma.progressScore.update({
      where: { id },
      data: {
        ...(dto.month !== undefined && { month: dto.month }),
        ...(dto.year !== undefined && { year: dto.year }),
        ...(dto.score !== undefined && { score: dto.score }),
      },
      include: SCORE_INCLUDE,
    });
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.progressScore.delete({ where: { id } });
    return { message: `Progress score #${id} deleted successfully` };
  }
}
