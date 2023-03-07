import { Module } from '@nestjs/common';
import { SoundGenerationController } from './controllers/sg.controller.js';
import { SoundGenerationService } from './services/sg.service.js';

@Module({
  imports: [],
  controllers: [SoundGenerationController],
  providers: [SoundGenerationService],
})
export class SoundGenerationModule {}
