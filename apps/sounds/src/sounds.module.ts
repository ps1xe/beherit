import { Module } from '@nestjs/common';
import { SoundsController } from './controllers/sounds.controller.js';
import { SoundsService } from './services/sounds.service.js';

@Module({
  controllers: [SoundsController],
  providers: [SoundsService],
})
export class SoundsModule {}
