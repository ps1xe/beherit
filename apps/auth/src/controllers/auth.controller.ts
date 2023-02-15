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
import { RpcExceptionFilter } from '../filters/rpc-exception.filter.js';
import { AuthService } from '../services/auth.service.js';

@Controller()
export class AuthController {
  constructor(
    @Inject(config.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @UseFilters(new RpcExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Register')
  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    const registerResponse = await this.authService.register(registerRequest);
    return {
      token: registerResponse.token,
      refreshToken: registerResponse.refreshToken,
    };
  }

  @UseFilters(new RpcExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Login')
  async login(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(loginRequest);
    return {
      token: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
    };
  }

  @UseFilters(new RpcExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'Validate')
  async validate(
    validateRequest: ValidateRequestDto,
  ): Promise<ValidateResponse> {
    const validateResponse = await this.authService.validate(validateRequest);
    return { userId: validateResponse.userId };
  }

  @UseFilters(new RpcExceptionFilter())
  @GrpcMethod(config.AUTH_SERVICE, 'UpdateTokens')
  async updateTokens(
    updateTokensRequest: UpdateTokensRequestDto,
  ): Promise<UpdateTokensResponse> {
    const updateTokensResponse = await this.authService.updateTokens(
      updateTokensRequest,
    );
    return {
      token: updateTokensResponse.token,
      refreshToken: updateTokensResponse.refreshToken,
    };
  }
}
