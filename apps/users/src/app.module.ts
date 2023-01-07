import { Module } from '@nestjs/common';
import { GetSoundsController } from './controllers/get-sounds.controller.js';
import { GetSoundsRepositoriy } from './repositories/get-sounds.repository.js';
import { GetSoundsService } from './services/get-sounds.service.js';

@Module({
  imports: [],
  controllers: [GetSoundsController],
  providers: [GetSoundsRepositoriy, GetSoundsService],
})
export class AppModule {}
