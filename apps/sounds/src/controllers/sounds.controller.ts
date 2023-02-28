import { Controller } from '@nestjs/common';
import {
  Sound,
  SOUNDS_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/sounds.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';
import { Inject } from '@nestjs/common';
import { SoundsService } from '../services/sounds.service.js';
import { UseFilters } from '@nestjs/common/decorators/core/exception-filters.decorator.js';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter.js';
import { FindOneDto } from '../dto/find-one.dto.js';
import { FindDto } from '../dto/find.dto.js';

@UseFilters(new RpcExceptionFilter())
@Controller()
export class SoundsController {
  constructor(
    @Inject(SoundsService)
    private readonly soundsService: SoundsService,
  ) {}

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'UploadSound')
  async uploadSound({ buffer, userId }: UploadSoundDto): Promise<Void> {
    return this.soundsService.uploadSound(buffer, userId);
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'FindOne')
  async findOne({ soundId }: FindOneDto): Promise<Sound> {
    return this.soundsService.findOne(soundId);
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'Find')
  async find({ userId }: FindDto): Promise<Sound[]> {
    return this.soundsService.find(userId);
  }
}
