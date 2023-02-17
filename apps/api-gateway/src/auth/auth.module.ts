import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
} from '@beherit/grpc/protobufs/auth.pb';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50051',
          package: AUTH_PACKAGE_NAME,
          protoPath: '../../libs/grpc/src/protos/auth.proto',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
