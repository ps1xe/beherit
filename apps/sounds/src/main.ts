import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SoundsModule } from './sounds.module.js';

async function bootstrap() {
  const app = await NestFactory.create(SoundsModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
