import { Module } from '@nestjs/common';
import { GetSoundsController } from './controllers/get-sounds.controller.js';
import { GetSoundsService } from './services/get-sounds.service.js';

@Module({
  imports: [],
  controllers: [GetSoundsController],
  providers: [GetSoundsService],
})
export class UserModule {}
