import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExtracurricularDto } from './dto/create-extracurricular.dto';
import { UpdateExtracurricularDto } from './dto/update-extracurricular.dto';

@Injectable()
export class ExtracurricularsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExtracurricularDto) {
    try {
      return await this.prisma.extracurricular.create({
        data: {
          name: dto.name,
          description: dto.description,
          schedule: dto.schedule,
          studentId: dto.studentId,
        },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ekstrakurikuler dengan nama ini sudah terdaftar.',
        );
      }
      throw err;
    }
  }

  findAll() {
    return this.prisma.extracurricular.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.extracurricular.findUnique({
      where: { id },
    });
    if (!record)
      throw new NotFoundException(`Ekstrakurikuler #${id} tidak ditemukan`);
    return record;
  }

  async update(id: string, dto: UpdateExtracurricularDto) {
    await this.findOne(id); // Cek ada atau nggak datanya dulu
    try {
      return await this.prisma.extracurricular.update({
        where: { id },
        data: dto,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ekstrakurikuler dengan nama ini sudah terdaftar.',
        );
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.extracurricular.delete({ where: { id } });
    return { message: `Ekstrakurikuler #${id} berhasil dihapus` };
  }
}
