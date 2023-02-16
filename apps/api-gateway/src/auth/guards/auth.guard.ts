import { AUTH_SERVICE_NAME } from '@beherit/grpc/protobufs/auth.pb';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | never {
    const req: Request = context.switchToHttp().getRequest();
    const cookies = req.cookies;
    const token = cookies.token;
    const userId = await this.authService.validate(token);
    return !!userId;
  }
}
