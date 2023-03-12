import {
  GenerateResponse,
  ML_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/sound-generation.pb';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GenerateDto } from '../dto/generate.dto.js';
import { MlService } from '../services/ml.service.js';

@Controller()
export class MlController {
  constructor(
    @Inject(MlService)
    private readonly mlService: MlService,
  ) {}

  @GrpcMethod(ML_SERVICE_NAME, 'Generate')
  async generate({
    genre,
    length,
    userId,
  }: GenerateDto): Promise<GenerateResponse> {
    return this.mlService.generate(genre, length, userId);
  }
}
