// src/parents/parents.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';

@Module({
  controllers: [ParentsController],
  providers: [ParentsService, PrismaService],
})
export class ParentsModule {}
