import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SoundsUploadService } from '../services/upload-sounds.service.js';
import { Express } from 'express';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { CurrentUserId } from '@beherit/common/decorators/current-user-id.decorator';

@Controller('sound')
export class S3SoundsController {
  constructor(private readonly soundsUploadService: SoundsUploadService) {}

  @Post('soundUpload')
  @UseInterceptors(FileInterceptor('file'))
  async soundUpload(
    @UploadedFile() file: Express.Multer.File,
    // @CurrentUserId() userId: string,
  ): Promise<Sound> {
    return this.soundsUploadService.uploadSound({
      dataBuffer: file.buffer,
      // userId: userId,
    });
  }
}
