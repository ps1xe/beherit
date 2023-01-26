import { config } from '@beherit/config';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service.js';

@Controller()
export class AuthController {
  constructor(
    @Inject(config.AUTH_SERVICE)
    private readonly appService: AuthService,
  ) {}

  @GrpcMethod('AuthService', 'Register')
  register(registerRequest): any {
    return 'ss';
  }
}
