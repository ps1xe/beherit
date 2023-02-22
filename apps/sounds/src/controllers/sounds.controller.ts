import { Controller } from '@nestjs/common';
import { SOUNDS_SERVICE_NAME } from '@beherit/grpc/protobufs/sounds.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';
import { Inject } from '@nestjs/common';
import { SoundsService } from '../services/sounds.service.js';

@Controller()
export class SoundsController {
  constructor(
    @Inject(SoundsService)
    private readonly soundsService: SoundsService,
  ) {}

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'UploadSound')
  async uploadSound({ buffer, userId }: UploadSoundDto): Promise<void> {
    this.soundsService.uploadSound(buffer, userId);
  }
}
