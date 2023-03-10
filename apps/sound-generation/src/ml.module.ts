import { Module } from '@nestjs/common';
import { SoundGenerationController } from './controllers/ml.controller.js';
import { SoundGenerationService } from './services/ml.service.js';

@Module({
  imports: [],
  controllers: [SoundGenerationController],
  providers: [SoundGenerationService],
})
export class SoundGenerationModule {}
