import { Module } from '@nestjs/common';
import { S3SoundsController } from './controllers/upload-sounds.controller.js';
import { SoundsUploadService } from './services/upload-sounds.service.js';

@Module({
  controllers: [S3SoundsController],
  providers: [SoundsUploadService],
})
export class SoundsModule {}
