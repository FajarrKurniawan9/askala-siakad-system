import { Module } from '@nestjs/common';
import { ExtracurricularsService } from './extracurriculars.service';
import { ExtracurricularsController } from './extracurriculars.controller';

@Module({
  controllers: [ExtracurricularsController],
  providers: [ExtracurricularsService],
})
export class ExtracurricularsModule {}
