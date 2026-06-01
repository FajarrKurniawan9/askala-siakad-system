// src/upload/upload.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly supabase: ReturnType<typeof createClient>;
  private readonly BUCKET = 'siakad-files';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey = process.env.SUPABASE_KEY as string;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing SUPABASE_URL or SUPABASE_KEY in environment variables',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname); // e.g. ".pdf", ".jpg"
    const uniqueFilename = `${Date.now()}-${uuidv4()}${ext}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKET)
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(this.BUCKET)
      .getPublicUrl(uniqueFilename);

    return publicUrlData.publicUrl;
  }
}
