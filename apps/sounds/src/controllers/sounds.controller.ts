import { Controller } from '@nestjs/common';
import {
  FindOneResponse,
  FindResponse,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { GrpcMethod } from '@nestjs/microservices';
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

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'FindOne')
  async findOne({ soundId }: FindOneDto): Promise<FindOneResponse> {
    const sound = await this.soundsService.findOne(soundId);
    return { data: sound };
  }

  @GrpcMethod(SOUNDS_SERVICE_NAME, 'Find')
  async find({ pageOptions, userId }: FindDto): Promise<FindResponse> {
    const page = await this.soundsService.find(pageOptions, userId);
    return { sounds: page.data, meta: page.meta };
  }
}
