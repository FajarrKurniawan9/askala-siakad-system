// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    // Use memory storage so file.buffer is available in the service.
    // Do NOT use diskStorage — the buffer must be passed directly to Supabase.
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // export so other modules (e.g. SubmissionsModule) can inject it
})
export class UploadModule {}
