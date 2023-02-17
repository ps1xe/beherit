import { Injectable } from '@nestjs/common';
import { s3 } from '@beherit/common/s3/s3-connection';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { config } from '@beherit/config';
import { GetUrlToDownloadRequestDto } from '../dto/get-url-request.dto.js';
import { GetUrlToDownloadResponseDto } from '../dto/get-url-response.dto.js';
import { Repository } from 'typeorm';

@Injectable()
export class GetSoundsService {
  soundRepository: Repository<Sound>;

  constructor() {
    this.soundRepository = typeorm.getRepository(Sound);
  }

  async getUrlToDownload({
    soundId,
  }: GetUrlToDownloadRequestDto): Promise<GetUrlToDownloadResponseDto> {
    const sound = await this.soundRepository.findOne({
      where: {
        id: soundId,
      },
    });
    const paramsForUrl = {
      Bucket: config.S3_BUCKET_NAME,
      Expires: 5000,
      Key: sound.key,
    };

    const url = await s3.getSignedUrlPromise('getObject', paramsForUrl);

    return { url: url };
  }

  // async GetListSounds({ userId }): Promise<Sound[]> {
  //   return [];
  // }
}
