import {
  SOUNDS_PACKAGE_NAME,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MlController } from './controllers/ml.controller.js';
import { MlService } from './services/ml.service.js';

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
  ],
  controllers: [MlController],
  providers: [MlService],
})
export class MlModule {}
