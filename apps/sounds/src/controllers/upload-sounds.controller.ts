import { Controller } from '@nestjs/common';
import { SoundsUploadService } from '../services/upload-sounds.service.js';
import { SOUNDS_SERVICE_NAME } from '@beherit/grpc/protobufs/sounds.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';

@Controller('sound')
export class S3SoundsController {
  constructor(private readonly soundsUploadService: SoundsUploadService) {}

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'UploadSound')
  async uploadSound({ buffer, userId }: UploadSoundDto): Promise<void> {
    console.log('zzz');
    return this.soundsUploadService.uploadSound({
      buffer: buffer,
      userId: userId,
    });
  }
}
