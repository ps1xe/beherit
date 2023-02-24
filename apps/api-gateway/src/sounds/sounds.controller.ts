import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/sounds.pb';
import type { ClientGrpc } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service.js';

@Controller('sounds')
export class SoundsController implements OnModuleInit {
  private svc: SoundsServiceClient;

  constructor(
    @Inject(SOUNDS_SERVICE_NAME)
    private readonly client: ClientGrpc,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<SoundsServiceClient>(SOUNDS_SERVICE_NAME);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('uploadSound')
  @UseGuards(AuthGuard)
  async uploadSound(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ): Promise<Void> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);
    return this.svc.uploadSound({
      buffer: file.buffer,
      userId: userId,
    });
  }
}
