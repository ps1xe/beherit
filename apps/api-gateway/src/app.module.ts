import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
