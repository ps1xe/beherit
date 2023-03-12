import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  MlServiceClient,
  ML_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/sound-generation.pb';
import type { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service.js';

@Controller('ml')
@UseGuards(AuthGuard)
export class MlController implements OnModuleInit {
  private svc: MlServiceClient;

  constructor(
    @Inject(ML_SERVICE_NAME)
    private readonly soundGenerationClient: ClientGrpc,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  onModuleInit(): void {
    this.svc =
      this.soundGenerationClient.getService<MlServiceClient>(ML_SERVICE_NAME);
  }

  @Post('generate')
  async generate(@Body() generateBody, @Req() request: Request): Promise<Void> {
    const token = request.cookies.token;
    const { userId } = await this.authService.validate(token);

    return this.svc.generate({
      genre: generateBody.genre,
      length: generateBody.length,
      userId: userId,
    });
  }
}
