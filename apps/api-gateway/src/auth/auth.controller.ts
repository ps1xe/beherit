import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  LoginResponse,
  RegisterResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import type {
  RegisterRequest,
  LoginRequest,
} from '@beherit/grpc/protobufs/auth.pb';
import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  private svc: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('register')
  async register(
    @Body() registerRequestBody: RegisterRequest,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(registerRequestBody);
  }

  @Put('login')
  async login(
    @Body() loginRequestBody: LoginRequest,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(loginRequestBody);
  }
}
