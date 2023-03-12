import {
  ML_PACKAGE_NAME,
  ML_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sound-generation.pb';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module.js';
import { MlController } from './ml.controller.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ML_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50054',
          package: ML_PACKAGE_NAME,
          protoPath: '../../libs/grpc/src/protos/sound-generation.proto',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [MlController],
})
export class MlModule {}
