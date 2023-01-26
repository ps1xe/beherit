import { Inject, Injectable } from '@nestjs/common';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { config } from '@beherit/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(config.AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
  ) {}

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    return this.authRepository.register(registerRequest);
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    return this.authRepository.login(loginRequest);
  }

  async validate(
    validateRequest: ValidateRequestDto,
  ): Promise<ValidateResponse> {
    return this.authRepository.validate(validateRequest);
  }
}
