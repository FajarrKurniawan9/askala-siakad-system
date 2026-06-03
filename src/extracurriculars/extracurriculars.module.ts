import { Module } from '@nestjs/common';
import { ExtracurricularsService } from './extracurriculars.service';
import { ExtracurricularsController } from './extracurriculars.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ExtracurricularsController],
  providers: [ExtracurricularsService, PrismaService],
})
export class ExtracurricularsModule {}
