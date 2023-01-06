import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { typeorm } from '../typeorm.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';
import { s3 } from '../s3-conection.js';
import { config } from '@beherit/config';

@Injectable()
export class SoundsUploadRepository {
  async uploadSound(uploadData: UploadSoundDto): Promise<Sound> {
    const uploadResult = await s3
      .upload({
        Bucket: config.S3_BUCKET_NAME,
        Body: uploadData.dataBuffer,
        Key: `${uuid()}`,
      })
      .promise();

    const soundStorageInDB = {
      key: uploadResult.Key,
      // userId: uploadData.userId,
    };

    const filestored = typeorm.getRepository(Sound).save(soundStorageInDB);

    return filestored;
  }
}
