import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { SoundsModule } from './sounds/sounds.module.js';

@Module({
  imports: [AuthModule, SoundsModule],
})
export class AppModule {}
