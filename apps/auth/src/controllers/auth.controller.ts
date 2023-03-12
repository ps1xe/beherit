import {
  AUTH_SERVICE_NAME,
  LoginResponse,
  RegisterResponse,
  UpdateTokensResponse,
  ValidateResponse,
  Void,
} from '@beherit/grpc/protobufs/auth.pb';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetLinkToResetPasswordRequestDto } from '../dto/get-link-to-reset-password-request.dto.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';
import { RegisterRequestDto } from '../dto/register-request.dto.js';
import { ResetPasswordDto } from '../dto/reset-password.dto.js';
import { UpdateTokensRequestDto } from '../dto/update-tokens-request.dto.js';
import { ValidateRequestDto } from '../dto/validate-request.dto.js';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter.js';
import { AuthService } from '../services/auth.service.js';

@UseFilters(new RpcExceptionFilter())
@Controller()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
  async register({
    username,
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    const registerResponse = await this.authService.register(
      username,
      email,
      password,
    );
    return {
      token: registerResponse.token,
      refreshToken: registerResponse.refreshToken,
      userInfo: registerResponse.userInfo,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  async login({ email, password }: LoginRequestDto): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(email, password);
    return {
      token: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
      userInfo: loginResponse.userInfo,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  async validate({ token }: ValidateRequestDto): Promise<ValidateResponse> {
    const validateResponse = await this.authService.validate(token);
    return { userId: validateResponse.userId };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'UpdateTokens')
  async updateTokens({
    refreshToken,
  }: UpdateTokensRequestDto): Promise<UpdateTokensResponse> {
    const updateTokensResponse = await this.authService.updateTokens(
      refreshToken,
    );
    return {
      token: updateTokensResponse.token,
      refreshToken: updateTokensResponse.refreshToken,
      userInfo: updateTokensResponse.userInfo,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'GetLinkToResetPassword')
  async getLinkToResetPassword({
    email,
  }: GetLinkToResetPasswordRequestDto): Promise<Void> {
    return this.authService.getLinkToResetPassword(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ResetPassword')
  async resetPassword({ token, newPassword }: ResetPasswordDto): Promise<Void> {
    return this.authService.resetPassword(token, newPassword);
  }
}
