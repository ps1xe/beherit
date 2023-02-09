import { config } from '@beherit/config';
import {
  LoginResponse,
  RegisterResponse,
  UpdateTokensResponse,
  ValidateResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { UpdateTokensRequestDto } from '../dto/update-tokens-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { LoginExceptionFilter } from '../filters/login-exception.filter.js';
import { RegistrationExceptionFilter } from '../filters/registration-exception.filter.js';
import { UpdateTokensExceptionFilter } from '../filters/update-tokens-exception.filter.js';
import { ValidateExceptionFilter } from '../filters/validate-exception.filter.js';
import { AuthService } from '../services/auth.service.js';

@Controller()
export class AuthController {
  constructor(
    @Inject(config.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @UseFilters(new RegistrationExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Register')
  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    this.authService.register(registerRequest);
    return { error: null };
  }

  @UseFilters(new LoginExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Login')
  async login(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(loginRequest);
    return {
      error: null,
      token: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
    };
  }

  @UseFilters(new ValidateExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Validate')
  async validate(
    validateRequest: ValidateRequestDto,
  ): Promise<ValidateResponse> {
    const validateResponse = await this.authService.validate(validateRequest);
    return { error: null, userId: validateResponse.userId };
  }

  @UseFilters(new UpdateTokensExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'UpdateTokens')
  async updateTokens(
    updateTokensRequest: UpdateTokensRequestDto,
  ): Promise<UpdateTokensResponse> {
    const updateTokensResponse = await this.authService.updateTokens(
      updateTokensRequest,
    );
    return {
      error: null,
      token: updateTokensResponse.token,
      refreshToken: updateTokensResponse.refreshToken,
    };
  }
}
