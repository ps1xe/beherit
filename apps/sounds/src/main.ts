import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { SoundsModule } from './sounds.module.js';
import { SOUNDS_PACKAGE_NAME } from '@beherit/grpc/protobufs/sounds.pb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: SOUNDS_PACKAGE_NAME,
    channelOptions: {
      'grpc.max_receive_message_length': 1024 * 1024 * 1024 * 50,
    },
    url: '0.0.0.0:50052',
    protoPath: join(
      dirname(fileURLToPath(import.meta.url)),
      '../../../../libs/grpc/src/protos/sounds.proto',
    ),
  },
} as MicroserviceOptions;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    SoundsModule,
    microserviceOptions,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.listen();
}
bootstrap();
