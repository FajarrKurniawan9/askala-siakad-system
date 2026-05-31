// src/students/students.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Prisma } from '@prisma/client';

const STUDENT_INCLUDE = {
  user: {
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
    },
  },
};

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    try {
      return await this.prisma.student.create({
        data: {
          nis: dto.nis,
          classRoom: dto.classRoom,
          major: dto.major,
          grade: dto.grade,
          isActive: dto.isActive ?? true,
          userId: dto.userId,
          ...(dto.parentId && { parentId: dto.parentId }),
        },
        include: STUDENT_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const fields = (err.meta?.target as string[]) ?? [];
          if (fields.includes('nis')) {
            throw new ConflictException(
              `A student with NIS "${dto.nis}" already exists`,
            );
          }
          if (fields.includes('userId')) {
            throw new ConflictException(
              `A student profile for userId ${dto.userId} already exists`,
            );
          }
          throw new ConflictException('Unique constraint violation');
        }
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: STUDENT_INCLUDE,
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: STUDENT_INCLUDE,
    });
    if (!student) throw new NotFoundException(`Student #${id} not found`);
    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.findOne(id);

    try {
      return await this.prisma.student.update({
        where: { id },
        data: {
          ...(dto.nis && { nis: dto.nis }),
          ...(dto.classRoom && { classRoom: dto.classRoom }),
          ...(dto.major && { major: dto.major }),
          ...(dto.grade && { grade: dto.grade }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
          ...(dto.parentId && { parentId: dto.parentId }),
        },
        include: STUDENT_INCLUDE,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          const fields = (err.meta?.target as string[]) ?? [];
          if (fields.includes('nis')) {
            throw new ConflictException(
              `A student with NIS "${dto.nis}" already exists`,
            );
          }
          throw new ConflictException('Unique constraint violation');
        }
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.student.delete({ where: { id } });
    return { message: `Student #${id} deleted successfully` };
  }
}
