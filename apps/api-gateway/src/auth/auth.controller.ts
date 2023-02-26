import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  Void,
} from '@beherit/grpc/protobufs/auth.pb';
import type {
  GetLinkToResetPasswordRequest,
  RegisterRequest,
  LoginRequest,
} from '@beherit/grpc/protobufs/auth.pb';
import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Res,
  Req,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private svc: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  async register(
    @Body() registerRequestBody: RegisterRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await lastValueFrom(this.svc.register(registerRequestBody));
    response.cookie('refreshToken', tokens.refreshToken);
    response.cookie('token', tokens.token);
  }

  @Put('login')
  async login(
    @Body() loginRequestBody: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await lastValueFrom(this.svc.login(loginRequestBody));
    response.cookie('refreshToken', tokens.refreshToken);
    response.cookie('token', tokens.token);
  }

  @Post('updateTokens')
  async updateTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const tokens = await lastValueFrom(
      this.svc.updateTokens({ refreshToken: request.cookies.refreshToken }),
    );
    response.cookie('refreshToken', tokens.refreshToken);
    response.cookie('token', tokens.token);
  }

  @Post('getLinkToResetPassword')
  async getLinkToResetPassword(
    @Body() getLinkToResetPasswordBody: GetLinkToResetPasswordRequest,
  ): Promise<Void> {
    return this.svc.getLinkToResetPassword(getLinkToResetPasswordBody);
  }
}
