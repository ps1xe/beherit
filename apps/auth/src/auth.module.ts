import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { config } from '@beherit/config';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_SERVICE_NAME } from '@beherit/grpc/protobufs/auth.pb';

@Module({
  imports: [
    JwtModule.register({
      secret: config.JWT_SECRET_KEY,
      signOptions: { expiresIn: '12d' },
    }),
  ],
  controllers: [AuthController],
  providers: [{ provide: AUTH_SERVICE_NAME, useClass: AuthService }],
})
export class AuthModule {}
