import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { MlModule } from './sound-generation/ml.module.js';
import { SoundsModule } from './sounds/sounds.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [AuthModule, UsersModule, MlModule, SoundsModule],
})
export class AppModule {}
