import { Sound } from '@beherit/typeorm/entities/Sound';
import { Injectable } from '@nestjs/common';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';
import { SoundsUploadRepository } from '../repositories/upload-sounds.repository.js';

@Injectable()
export class SoundsUploadService {
  constructor(
    private readonly soundsUploadRepository: SoundsUploadRepository,
  ) {}

  async uploadSound(uploadData: UploadSoundDto): Promise<Sound> {
    return this.soundsUploadRepository.uploadSound(uploadData);
  }
}
