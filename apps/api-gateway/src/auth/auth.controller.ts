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
  Param,
  UseFilters,
  Get,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import type { Request, Response } from 'express';
import { GrpcExceptionFilter } from '../filters/http-exception.filter.js';

@UseFilters(GrpcExceptionFilter)
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
  ): Promise<any> {
    const authenticationInformation = await lastValueFrom(
      this.svc.register(registerRequestBody),
    );
    response.cookie('refreshToken', authenticationInformation.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('token', authenticationInformation.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return authenticationInformation.userInfo;
  }

  @Put('login')
  async login(
    @Body() loginRequestBody: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const authenticationInformation = await lastValueFrom(
      this.svc.login(loginRequestBody),
    );
    response.cookie('refreshToken', authenticationInformation.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('token', authenticationInformation.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return authenticationInformation.userInfo;
  }

  @Post('updateTokens')
  async updateTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const authenticationInformation = await lastValueFrom(
      this.svc.updateTokens({ refreshToken: request.cookies.refreshToken }),
    );
    response.cookie('refreshToken', authenticationInformation.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('token', authenticationInformation.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return authenticationInformation.userInfo;
  }

  @Post('getLinkToResetPassword')
  async getLinkToResetPassword(
    @Body() getLinkToResetPasswordBody: GetLinkToResetPasswordRequest,
  ): Promise<Void> {
    return this.svc.getLinkToResetPassword(getLinkToResetPasswordBody);
  }

  @Post('resetPassword/:token')
  async resetPassword(
    @Body() resetPasswordBody,
    @Param('token') token: string,
  ): Promise<Void> {
    return this.svc.resetPassword({
      token: token,
      newPassword: resetPasswordBody.newPassword,
    });
  }

  @Get('verificationRecoveryToken/:token')
  async verificationRecoveryToken(
    @Param('token') token: string,
  ): Promise<boolean> {
    const { isValid } = await lastValueFrom(
      this.svc.verificationRecoveryToken({ token }),
    );
    return isValid;
  }

  @Get('unlogin')
  async unlogin(@Res({ passthrough: true }) response: Response): Promise<void> {
    response.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
