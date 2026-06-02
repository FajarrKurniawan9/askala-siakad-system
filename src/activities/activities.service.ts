import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

const ACTIVITY_INCLUDE = {
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
} satisfies Prisma.ActivityLogInclude;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateActivityDto) {
    try {
      return await this.prisma.activityLog.create({
        data: {
          title: dto.title,
          type: dto.type,
          description: dto.description,
          ...(dto.date && { date: new Date(dto.date) }),
          studentId: dto.studentId,
        },
        include: ACTIVITY_INCLUDE,
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
    return this.prisma.activityLog.findMany({
      where: studentId ? { studentId } : undefined,
      include: ACTIVITY_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const activity = await this.prisma.activityLog.findUnique({
      where: { id },
      include: ACTIVITY_INCLUDE,
    });
    if (!activity)
      throw new NotFoundException(`Activity #${id} not found`);
    return activity;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateActivityDto) {
    await this.findOne(id);
    return this.prisma.activityLog.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.type && { type: dto.type }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.date && { date: new Date(dto.date) }),
      },
      include: ACTIVITY_INCLUDE,
    });
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.activityLog.delete({ where: { id } });
    return { message: `Activity #${id} deleted successfully` };
  }
}
