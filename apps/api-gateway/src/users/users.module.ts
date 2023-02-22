import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: USER_PACKAGE_NAME,
          protoPath: '../../libs/grpc/src/protos/user.proto',
        },
      },
    ]),
    MulterModule.register(),
    AuthModule,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
