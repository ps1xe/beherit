import { AUTH_SERVICE_NAME } from '@beherit/grpc/protobufs/auth.pb';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/index.js';
import { Request } from 'express';
import { AuthService } from '../auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | never {
    const req: Request = context.switchToHttp().getRequest();
    const cookies = req.cookies;
    const token = cookies.token;
    //ERROR [ExceptionsHandler] this.authService.validate is not a function
    const userId = await this.authService.validate(token);
    return !!userId;
  }
}
