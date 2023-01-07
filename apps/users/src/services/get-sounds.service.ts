import { Injectable } from '@nestjs/common';
import { GetSoundsRepositoriy } from '../repositories/get-sounds.repository.js';

@Injectable()
export class GetSoundsService {
  constructor(private readonly getSoundRepository: GetSoundsRepositoriy) {}
  async getUrlToDownload(id: string): Promise<string> {
    return this.getSoundRepository.getUrlToDownload(id);
  }
}
