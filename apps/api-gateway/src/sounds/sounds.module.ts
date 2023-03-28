import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  SOUNDS_PACKAGE_NAME,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { SoundsController } from './sounds.controller.js';

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
  ],

  controllers: [SoundsController],
})
export class SoundsModule {}
