// src/submissions/submissions.service.ts
import {
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
    await this.findOne(id);

    return this.prisma.paymentSubmission.update({
      where: { id },
      data: {
        ...(dto.fileUrl !== undefined && { fileUrl: dto.fileUrl }),
        ...(dto.status && { status: dto.status }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.verifiedBy !== undefined && { verifiedBy: dto.verifiedBy }),
        ...(dto.status === 'VERIFIED' && { verifiedAt: new Date() }),
      },
      include: SUBMISSION_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.paymentSubmission.delete({ where: { id } });
    return { message: `Submission #${id} deleted successfully` };
  }
}
