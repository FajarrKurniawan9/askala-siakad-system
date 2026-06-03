import { Module } from '@nestjs/common';
import { ProgressScoresService } from './progress-scores.service';
import { ProgressScoresController } from './progress-scores.controller';

@Module({
  controllers: [ProgressScoresController],
  providers: [ProgressScoresService],
})
export class ProgressScoresModule {}
