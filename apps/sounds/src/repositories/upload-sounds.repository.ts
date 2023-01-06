import { Injectable } from '@nestjs/common';
import s3Stream from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { typeorm } from '../typeorm.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { config } from '@beherit/config';
import { UploadSoundDto } from '../dto/upload-sound.dto.js';

@Injectable()
export class SoundsUploadRepository {
  async uploadSound(uploadData: UploadSoundDto): Promise<Sound> {
    const s3 = new s3Stream.S3({
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
      endpoint: new s3Stream.Endpoint(config.S3_ENDPOINT),
      region: config.S3_REGION,
      s3ForcePathStyle: config.S3_FORCE_PATH_STYLE,
      signatureVersion: config.S3_SIGNATURE_VERSION,
    });

    const uploadResult = await s3
      .upload({
        Bucket: config.S3_BUCKET_NAME,
        Body: uploadData.dataBuffer,
        Key: `${uuid()}`,
      })
      .promise();

    const soundStorageInDB = {
      link: uploadResult.Location,
      key: uploadResult.Key,
      // user: uploadData.userId,
    };

    const filestored = typeorm.getRepository(Sound).save(soundStorageInDB);

    return filestored;
  }
}
