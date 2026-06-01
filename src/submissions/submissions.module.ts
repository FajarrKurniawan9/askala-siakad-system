// src/submissions/submissions.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService, PrismaService],
  imports: [UploadModule],
})
export class SubmissionsModule {}
