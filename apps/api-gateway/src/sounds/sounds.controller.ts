import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUserId } from './decorators/current-user-id.decorator.js';
import {
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import type { ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sounds')
export class SoundsController {
  private svc: SoundsServiceClient;

  constructor(
    @Inject(SOUNDS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<SoundsServiceClient>(SOUNDS_SERVICE_NAME);
  }

  @Post('uploadSound')
  // @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSound(
    @UploadedFile() file: Express.Multer.File,
    // @CurrentUserId() userId: string,
  ) {
    this.svc.uploadSound({ buffer: file.buffer, userId: 'userId' });
  }
}
