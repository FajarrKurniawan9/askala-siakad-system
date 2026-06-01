// src/submissions/submissions.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

const SUBMISSION_INCLUDE = {
  bill: true,
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
};

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubmissionDto) {
    try {
      return await this.prisma.paymentSubmission.create({
        data: {
          billId: dto.billId,
          studentId: dto.studentId,
          ...(dto.fileUrl && { fileUrl: dto.fileUrl }),
        },
        include: SUBMISSION_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `A submission for billId "${dto.billId}" and studentId "${dto.studentId}" already exists`,
          );
        }
        if (err.code === 'P2003') {
          throw new NotFoundException(
            `Referenced bill or student does not exist`,
          );
        }
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.paymentSubmission.findMany({
      include: SUBMISSION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.paymentSubmission.findUnique({
      where: { id },
      include: SUBMISSION_INCLUDE,
    });
    if (!submission) throw new NotFoundException(`Submission #${id} not found`);
    return submission;
  }

  async update(id: string, dto: UpdateSubmissionDto) {
    // ── Guard: submission must exist before entering any transaction ──
    await this.findOne(id);

    // ── Non-verification updates: simple update, no transaction needed ──
    if (dto.status !== 'VERIFIED') {
      return this.prisma.paymentSubmission.update({
        where: { id },
        data: {
          ...(dto.fileUrl !== undefined && { fileUrl: dto.fileUrl }),
          ...(dto.status && { status: dto.status }),
          ...(dto.note !== undefined && { note: dto.note }),
          ...(dto.verifiedBy !== undefined && { verifiedBy: dto.verifiedBy }),
        },
        include: SUBMISSION_INCLUDE,
      });
    }

    // ── Verification path: interactive transaction ────────────────────
    // verifiedBy carries the admin's userId as a string (e.g. from JWT payload)
    const adminId = dto.verifiedBy ?? null;
    const adminIdInt = adminId !== null ? parseInt(adminId, 10) : null;

    if (adminIdInt === null || isNaN(adminIdInt)) {
      throw new BadRequestException(
        'verifiedBy (admin user ID) is required when verifying a submission',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // ── Step 0: Re-fetch submission with bill inside the transaction ──
      // This ensures we read consistent data and get bill.amount / bill.orgId
      const submission = await tx.paymentSubmission.findUnique({
        where: { id },
        include: {
          bill: true,
          student: true,
        },
      });

      // Should never be null here, but guard defensively
      if (!submission) {
        throw new NotFoundException(`Submission #${id} not found`);
      }

      if (!submission.bill) {
        throw new NotFoundException(
          `Bill associated with Submission #${id} not found`,
        );
      }

      const { bill, studentId } = submission;

      // ── Step 1: Update PaymentSubmission → VERIFIED ───────────────
      const updatedSubmission = await tx.paymentSubmission.update({
        where: { id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: String(adminIdInt),
          ...(dto.note !== undefined && { note: dto.note }),
          ...(dto.fileUrl !== undefined && { fileUrl: dto.fileUrl }),
        },
        include: SUBMISSION_INCLUDE,
      });

      // ── Step 2: Record incoming treasury transaction ───────────────
      // TreasuryTransaction.orgId is required (non-nullable in schema),
      // so we can only create this record when the bill has an orgId.
      if (bill.orgId) {
        await tx.treasuryTransaction.create({
          data: {
            type: 'IN',
            title: `Pembayaran ${bill.title} - Submission #${id}`,
            amount: bill.amount,
            date: new Date(),
            description: `Auto-recorded from verified payment submission #${id}`,
            orgId: bill.orgId,
            createdById: adminIdInt,
          },
        });
      }

      // ── Step 3: Insert activity log for the student ────────────────
      await tx.activityLog.create({
        data: {
          title: `Pembayaran ${bill.title} Berhasil Diverifikasi`,
          type: 'Pembayaran',
          description: `Pembayaran untuk tagihan "${bill.title}" sebesar Rp ${bill.amount.toLocaleString('id-ID')} telah diverifikasi.`,
          date: new Date(),
          studentId: studentId,
        },
      });

      return updatedSubmission;
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.paymentSubmission.delete({ where: { id } });
    return { message: `Submission #${id} deleted successfully` };
  }
}
