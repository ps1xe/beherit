import { config } from '@beherit/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

export const app = await NestFactory.create(AppModule);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(config.SECRET_COOKIES_KEY));
  await app.listen(4000);
}
bootstrap();
