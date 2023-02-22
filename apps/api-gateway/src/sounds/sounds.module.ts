import {
  SOUNDS_PACKAGE_NAME,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum.js';
import { SoundsController } from './sounds.controller.js';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SOUNDS_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: SOUNDS_PACKAGE_NAME,
          protoPath: '../../libs/grpc/src/protos/sounds.proto',
        },
      },
    ]),
    MulterModule.register(),
    AuthModule,
  ],
  controllers: [SoundsController],
  providers: [],
})
export class SoundsModule {}
