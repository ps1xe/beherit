import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { S3SoundsController } from './controllers/s3.sounds.controller.js';
import { SoundsUploadRepository } from './repositories/upload-sounds.repository.js';
import { SoundsUploadService } from './services/upload-sounds.service.js';

@Module({
  imports: [MulterModule.register()],
  controllers: [S3SoundsController],
  providers: [SoundsUploadService, SoundsUploadRepository],
})
export class SoundsModule {}
