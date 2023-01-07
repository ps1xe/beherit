import { Controller, Get, Param } from '@nestjs/common';
import { GetSoundsService } from '../services/get-sounds.service.js';

@Controller('user')
export class GetSoundsController {
  constructor(private readonly getSoundsService: GetSoundsService) {}

  @Get('download/:id')
  async getUrlToDownload(@Param('id') id: string): Promise<string> {
    return this.getSoundsService.getUrlToDownload(id);
  }
}
