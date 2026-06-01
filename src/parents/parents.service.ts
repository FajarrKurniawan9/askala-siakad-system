import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

const PARENT_INCLUDE = {
  user: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  children: {
    select: {
      id: true,
      nis: true,
      classRoom: true,
      major: true,
      grade: true,
      isActive: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.ParentInclude;

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateParentDto) {
    try {
      return await this.prisma.parent.create({
        data: { userId: dto.userId },
        include: PARENT_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `A Parent profile for userId ${dto.userId} already exists`,
          );
        }
        if (err.code === 'P2003') {
          throw new NotFoundException(
            `User #${dto.userId} not found — cannot create Parent profile`,
          );
        }
      }
      throw err;
    }
  }

  // ── Find all ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.parent.findMany({
      include: PARENT_INCLUDE,
      orderBy: { user: { firstName: 'asc' } },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: PARENT_INCLUDE,
    });
    if (!parent) throw new NotFoundException(`Parent #${id} not found`);
    return parent;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateParentDto) {
    await this.findOne(id);
    try {
      return await this.prisma.parent.update({
        where: { id },
        data: {
          ...(dto.userId !== undefined && { userId: dto.userId }),
        },
        include: PARENT_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `A Parent profile for userId ${dto.userId} already exists`,
          );
        }
        if (err.code === 'P2003') {
          throw new NotFoundException(
            `User #${dto.userId} not found — cannot reassign Parent profile`,
          );
        }
      }
      throw err;
    }
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.parent.delete({ where: { id } });
    return { message: `Parent #${id} deleted successfully` };
  }
}
