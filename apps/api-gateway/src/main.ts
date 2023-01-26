import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

export const app = await NestFactory.create(AppModule);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
