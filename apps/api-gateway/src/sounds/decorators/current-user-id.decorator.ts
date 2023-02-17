import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service.js';

export const CurrentUserId = createParamDecorator(
  async (_: undefined, ctx: ExecutionContext) => {
    let authService: AuthService;
    const req: Request = ctx.switchToHttp().getRequest();
    const token = req.cookies.token;
    console.log(authService);
    const userId = await authService.validate(token);

    return userId;
  },
);
