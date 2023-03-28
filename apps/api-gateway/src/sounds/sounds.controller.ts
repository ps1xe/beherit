import {
  Controller,
  Delete,
  Inject,
  OnModuleInit,
  Param,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { GrpcExceptionFilter } from '../filters/http-exception.filter.js';

@UseFilters(GrpcExceptionFilter)
@Controller('sounds')
@UseGuards(AuthGuard)
export class SoundsController implements OnModuleInit {
  private svc: SoundsServiceClient;

  constructor(
    @Inject(SOUNDS_SERVICE_NAME)
    private readonly soundsClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.svc =
      this.soundsClient.getService<SoundsServiceClient>(SOUNDS_SERVICE_NAME);
  }

  @Delete('deleteSound/:id')
  async deleteSound(@Param('id') soundId): Promise<void> {
    const deleteSound = await lastValueFrom(this.svc.delete({ soundId }));
  }
}
