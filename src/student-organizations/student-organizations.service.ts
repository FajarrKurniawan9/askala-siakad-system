import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentOrganizationDto } from './dto/create-student-organization.dto';
import { UpdateStudentOrganizationDto } from './dto/update-student-organization.dto';

const STUDENT_ORG_INCLUDE = {
  student: {
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
  },
  org: true,
} satisfies Prisma.StudentOrganizationInclude;

@Injectable()
export class StudentOrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentOrganizationDto) {
    try {
      return await this.prisma.studentOrganization.create({
        data: {
          studentId: dto.studentId,
          orgId: dto.orgId,
          role: dto.role,
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
        include: STUDENT_ORG_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            'Siswa ini sudah terdaftar di organisasi tersebut.',
          );
        }
        if (err.code === 'P2003') {
          throw new NotFoundException('Siswa atau Organisasi tidak ditemukan.');
        }
      }
      throw err;
    }
  }

  findAll() {
    return this.prisma.studentOrganization.findMany({
      include: STUDENT_ORG_INCLUDE,
      orderBy: { joinedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.studentOrganization.findUnique({
      where: { id },
      include: STUDENT_ORG_INCLUDE,
    });
    if (!record)
      throw new NotFoundException(
        `Data Anggota Organisasi #${id} tidak ditemukan`,
      );
    return record;
  }

  async update(id: string, dto: UpdateStudentOrganizationDto) {
    await this.findOne(id);
    try {
      return await this.prisma.studentOrganization.update({
        where: { id },
        data: {
          ...(dto.studentId && { studentId: dto.studentId }),
          ...(dto.orgId && { orgId: dto.orgId }),
          ...(dto.role && { role: dto.role }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
        include: STUDENT_ORG_INCLUDE,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Siswa ini sudah terdaftar di organisasi tersebut.',
        );
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.studentOrganization.delete({ where: { id } });
    return { message: `Data Anggota Organisasi #${id} berhasil dihapus` };
  }
}
