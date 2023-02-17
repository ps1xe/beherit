import {
  SOUNDS_PACKAGE_NAME,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SoundsController } from './sounds.controller.js';
import { MulterModule } from '@nestjs/platform-express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// import {} from '../../../../libs/grpc/src/protos/sounds.proto';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SOUNDS_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50052',
          package: SOUNDS_PACKAGE_NAME,
          protoPath: join(
            dirname(fileURLToPath(import.meta.url)),
            '../../../../../libs/grpc/src/protos/sounds.proto',
          ),
        },
      },
    ]),
    MulterModule.register(),
  ],
  controllers: [SoundsController],
  providers: [],
})
export class SoundsModule {}
