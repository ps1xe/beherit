import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { config } from '@beherit/config';
import { AuthRepository } from './repositories/auth.repository.js';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    { provide: config.AUTH_SERVICE, useClass: AuthService },
    { provide: config.AUTH_REPOSITORY, useClass: AuthRepository },
  ],
})
export class AuthModule {}
