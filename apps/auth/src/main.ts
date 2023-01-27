import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum.js';
import { AuthModule } from './auth.module.js';
import { AUTH_PACKAGE_NAME } from '@beherit/grpc/protobufs/auth.pb';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: AUTH_PACKAGE_NAME,
    channelOptions: {
      'grpc.max_receive_message_length': 1024 * 1024 * 1024 * 50,
    },
    url: '0.0.0.0:50051',
    protoPath: '../../libs/grpc/src/protos/auth.proto',
  },
} as MicroserviceOptions;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AuthModule,
    microserviceOptions,
  );
  app.useGlobalPipes(new ValidationPipe());

  app.listen();
}
bootstrap();
