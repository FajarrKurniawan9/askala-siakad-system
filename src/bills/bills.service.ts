import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

const BILL_INCLUDE = {
  org: true,
} satisfies Prisma.PaymentBillInclude;

@Injectable()
export class BillsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(dto: CreateBillDto) {
    try {
      return await this.prisma.paymentBill.create({
        data: {
          title: dto.title,
          amount: dto.amount,
          dueDate: new Date(dto.dueDate),
          description: dto.description,
          ...(dto.orgId && { orgId: dto.orgId }),
        },
        include: BILL_INCLUDE,
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

  async findAll() {
    return this.prisma.paymentBill.findMany({
      include: BILL_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const bill = await this.prisma.paymentBill.findUnique({
      where: { id },
      include: BILL_INCLUDE,
    });
    if (!bill) throw new NotFoundException(`Bill #${id} not found`);
    return bill;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateBillDto) {
    await this.findOne(id);
    try {
      return await this.prisma.paymentBill.update({
        where: { id },
        data: {
          ...(dto.title && { title: dto.title }),
          ...(dto.amount !== undefined && { amount: dto.amount }),
          ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.orgId !== undefined && { orgId: dto.orgId }),
        },
        include: BILL_INCLUDE,
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
    await this.prisma.paymentBill.delete({ where: { id } });
    return { message: `Bill #${id} deleted successfully` };
  }
}
