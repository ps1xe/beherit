import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { config } from '@beherit/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '12d' },
    }),
  ],
  controllers: [AuthController],
  providers: [{ provide: config.AUTH_SERVICE, useClass: AuthService }],
})
export class AuthModule {}
