import { config } from '@beherit/config';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { AuthService } from '../services/auth.service.js';

@Controller()
export class AuthController {
  constructor(
    @Inject(config.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod(config.AUTH_SERVICE, 'Register')
  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  @GrpcMethod(config.AUTH_SERVICE, 'Login')
  async login(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    return this.authService.login(loginRequest);
  }

  @GrpcMethod(config.AUTH_SERVICE, 'Validate')
  async validate(
    validateRequest: ValidateRequestDto,
  ): Promise<ValidateResponse> {
    return this.authService.validate(validateRequest);
  }
}
