import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums/transport.enum.js';
import { UserModule } from './user.module.js';
import { USER_PACKAGE_NAME } from '@beherit/grpc/protobufs/user.pb';

const microserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: USER_PACKAGE_NAME,
    channelOptions: {
      'grpc.max_receive_message_length': 1024 * 1024 * 1024 * 50,
    },
    url: '0.0.0.0:50052',
    protoPath: '../../libs/grpc/src/protos/user.proto',
  },
} as MicroserviceOptions;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    UserModule,
    microserviceOptions,
  );
  app.useGlobalPipes(new ValidationPipe());

  app.listen();
}
bootstrap();
