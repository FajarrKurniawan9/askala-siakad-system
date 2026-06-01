import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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
} satisfies Prisma.PaymentSubmissionInclude;

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Create ──────────────────────────────────────────────────────────────────

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

  // ── Find all ─────────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.paymentSubmission.findMany({
      include: SUBMISSION_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findOne(id: string) {
    const submission = await this.prisma.paymentSubmission.findUnique({
      where: { id },
      include: SUBMISSION_INCLUDE,
    });
    if (!submission) throw new NotFoundException(`Submission #${id} not found`);
    return submission;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateSubmissionDto) {
    await this.findOne(id);

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

    // Verification path: verifiedBy carries the admin's userId string from the JWT payload.
    const adminIdInt =
      dto.verifiedBy !== undefined ? parseInt(dto.verifiedBy, 10) : NaN;
    if (isNaN(adminIdInt)) {
      throw new BadRequestException(
        'verifiedBy (admin user ID) is required when verifying a submission',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Re-fetch inside the transaction to read bill.amount and bill.orgId consistently,
      // guarding against the bill being deleted between the outer findOne and this point.
      const submission = await tx.paymentSubmission.findUnique({
        where: { id },
        include: { bill: true, student: true },
      });
      if (!submission)
        throw new NotFoundException(`Submission #${id} not found`);
      if (!submission.bill)
        throw new NotFoundException(
          `Bill associated with Submission #${id} not found`,
        );

      const { bill, studentId } = submission;

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

      // TreasuryTransaction.orgId is non-nullable in the schema, so only record
      // an incoming transaction when the bill is linked to an org.
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

      await tx.activityLog.create({
        data: {
          title: `Pembayaran ${bill.title} Berhasil Diverifikasi`,
          type: 'Pembayaran',
          description: `Pembayaran untuk tagihan "${bill.title}" sebesar Rp ${bill.amount.toLocaleString('id-ID')} telah diverifikasi.`,
          date: new Date(),
          studentId,
        },
      });

      return updatedSubmission;
    });
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.paymentSubmission.delete({ where: { id } });
    return { message: `Submission #${id} deleted successfully` };
  }
}
