import { Injectable } from '@nestjs/common';
import { s3 } from '@beherit/common/s3/s3-connection';
import { typeorm } from '@beherit/typeorm/typeorm-connection';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { config } from '@beherit/config';

@Injectable()
export class GetSoundsRepositoriy {
  async getUrlToDownload(id: string): Promise<string> {
    const Key = await typeorm.getRepository(Sound).findOne({
      where: {
        id: id,
      },
    });

    const paramsForUrl = {
      Bucket: config.S3_BUCKET_NAME,
      Expires: 5000,
      Key: Key.key,
    };

    const url = await s3.getSignedUrlPromise('getObject', paramsForUrl);

    return url;
  }
}
