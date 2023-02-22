import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { SoundsModule } from './sounds/sounds.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [AuthModule, SoundsModule, UsersModule],
})
export class AppModule {}
