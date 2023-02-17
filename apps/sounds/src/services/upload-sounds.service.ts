import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';
import { config } from '@beherit/config';
import { s3 } from '../s3-connection.js';

@Injectable()
export class SoundsUploadService {
  async uploadSound(uploadData: UploadSoundDto): Promise<void> {
    const uploadResult = await s3
      .upload({
        Bucket: config.S3_BUCKET_NAME,
        Body: uploadData.buffer,
        Key: `${uuid()}.mp3`,
      })
      .promise();

    const soundStorageInDB = {
      key: uploadResult.Key,
      userId: uploadData.userId,
    };

    typeorm.getRepository(Sound).save(soundStorageInDB);
  }
}
