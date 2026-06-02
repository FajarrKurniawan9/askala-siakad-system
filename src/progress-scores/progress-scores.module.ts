import { Module } from '@nestjs/common';
import { ProgressScoresService } from './progress-scores.service';
import { ProgressScoresController } from './progress-scores.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProgressScoresController],
  providers: [ProgressScoresService, PrismaService],
})
export class ProgressScoresModule {}
