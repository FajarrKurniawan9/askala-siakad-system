// src/bills/bills.module.ts
import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BillsController],
  providers: [BillsService, PrismaService],
})
export class BillsModule {}
