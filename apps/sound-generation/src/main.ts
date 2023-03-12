import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MlModule } from './ml.module.js';
import { ML_PACKAGE_NAME } from '@beherit/grpc/protobufs/sound-generation.pb';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: ML_PACKAGE_NAME,
    channelOptions: {
      'grpc.max_receive_message_length': 1024 * 1024 * 1024 * 50,
    },
    url: '0.0.0.0:50054',
    protoPath: '../../libs/grpc/src/protos/sound-generation.proto',
  },
} as MicroserviceOptions;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    MlModule,
    microserviceOptions,
  );

  app.useGlobalPipes(new ValidationPipe());

  app.listen();
}
bootstrap();
