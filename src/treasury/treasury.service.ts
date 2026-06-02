import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTreasuryDto } from './dto/create-treasury.dto';
import { UpdateTreasuryDto } from './dto/update-treasury.dto';

const TREASURY_INCLUDE = {
  org: true,
} satisfies Prisma.TreasuryTransactionInclude;

@Injectable()
export class TreasuryService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateTreasuryDto) {
    try {
      return await this.prisma.treasuryTransaction.create({
        data: {
          type: dto.type,
          title: dto.title,
          amount: dto.amount,
          date: new Date(dto.date),
          description: dto.description,
          createdById: dto.createdById,
          orgId: dto.orgId,
        },
        include: TREASURY_INCLUDE,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new NotFoundException(`Organization #${dto.orgId} not found`);
      }
      throw err;
    }
  }

  // ── Find all ─────────────────────────────────────────────────────────────────

  async findAll(orgId?: string) {
    return this.prisma.treasuryTransaction.findMany({
      where: orgId ? { orgId } : undefined,
      include: TREASURY_INCLUDE,
      orderBy: { date: 'desc' },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const tx = await this.prisma.treasuryTransaction.findUnique({
      where: { id },
      include: TREASURY_INCLUDE,
    });
    if (!tx)
      throw new NotFoundException(`Treasury transaction #${id} not found`);
    return tx;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateTreasuryDto) {
    await this.findOne(id);
    try {
      return await this.prisma.treasuryTransaction.update({
        where: { id },
        data: {
          ...(dto.type && { type: dto.type }),
          ...(dto.title && { title: dto.title }),
          ...(dto.amount !== undefined && { amount: dto.amount }),
          ...(dto.date && { date: new Date(dto.date) }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.createdById !== undefined && {
            createdById: dto.createdById,
          }),
          ...(dto.orgId && { orgId: dto.orgId }),
        },
        include: TREASURY_INCLUDE,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2003'
      ) {
        throw new NotFoundException(`Organization #${dto.orgId} not found`);
      }
      throw err;
    }
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.treasuryTransaction.delete({ where: { id } });
    return { message: `Treasury transaction #${id} deleted successfully` };
  }
}
