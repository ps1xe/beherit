import { Controller } from '@nestjs/common';
import {
  FindOneResponse,
  FindResponse,
  SOUNDS_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/sounds.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { SoundsService } from '../services/sounds.service.js';
import { UseFilters } from '@nestjs/common/decorators/core/exception-filters.decorator.js';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter.js';
import { FindOneDto } from '../dto/find-one.dto.js';
import { FindDto } from '../dto/find.dto.js';
import { SaveDto } from '../dto/save.dto.js';
import { SaveResponseDto } from '../dto/save-response.dto.js';
import { DeleteDto } from '../dto/delete.dto.js';

@UseFilters(new RpcExceptionFilter())
@Controller()
export class SoundsController {
  constructor(
    @Inject(SoundsService)
    private readonly soundsService: SoundsService,
  ) {}

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'FindOne')
  async findOne({ soundId }: FindOneDto): Promise<FindOneResponse> {
    return this.soundsService.findOne(soundId);
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'Find')
  async find({ pageOptions, userId }: FindDto): Promise<FindResponse> {
    const page = await this.soundsService.find(pageOptions, userId);
    return { sounds: page.data, meta: page.meta };
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'Save')
  async save({
    id,
    name,
    key,
    userId,
    genre,
    length,
    loaded,
  }: SaveDto): Promise<SaveResponseDto> {
    return this.soundsService.save(
      name,
      key,
      userId,
      genre,
      length,
      loaded,
      id,
    );
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'Delete')
  async deleteSound({ soundId }: DeleteDto): Promise<Void> {
    return this.soundsService.deleteSound(soundId);
  }
}
