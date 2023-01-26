import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum.js';
import { join } from 'path';
import { AuthModule } from './auth.module.js';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'auth',
    channelOptions: {
      'grpc.max_receive_message_length': 1024 * 1024 * 1024 * 50,
    },
    url: '0.0.0.0:50051',
    protoPath: join(process.cwd(), '../../libs/grpc/src/protos/auth.proto'),
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
