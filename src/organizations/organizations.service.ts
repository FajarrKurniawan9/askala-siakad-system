// src/organizations/organizations.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    try {
      return await this.prisma.schoolOrg.create({
        data: {
          name: dto.name,
          description: dto.description,
          isActive: dto.isActive ?? true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `An organization with name "${dto.name}" already exists`,
          );
        }
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.schoolOrg.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const org = await this.prisma.schoolOrg.findUnique({
      where: { id },
    });
    if (!org) throw new NotFoundException(`Organization #${id} not found`);
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    try {
      return await this.prisma.schoolOrg.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `An organization with name "${dto.name}" already exists`,
          );
        }
      }
      throw err;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.schoolOrg.delete({ where: { id } });
    return { message: `Organization #${id} deleted successfully` };
  }
}
