import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { config } from '@beherit/config';
import { s3 } from '../s3-connection.js';
import { Repository } from 'typeorm';
import { Void } from '@beherit/grpc/protobufs/sounds.pb';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SoundsService implements OnModuleInit {
  private soundRepository: Repository<Sound>;

  onModuleInit(): void {
    this.soundRepository = typeorm.getRepository(Sound);
  }

  //----------------------------------------------------------------
  async uploadSound(buffer: Buffer, userId: string): Promise<Void> {
    const uploadResult = await s3
      .upload({
        Bucket: config.S3_BUCKET_NAME_SOUNDS,
        Body: buffer,
        Key: `${uuid()}.mp3`,
      })
      .promise();

    const soundStorageInDB = {
      key: uploadResult.Key,
      userId: userId,
    };

    try {
      this.soundRepository.save(soundStorageInDB);
    } catch (exception) {
      throw new RpcException('Failed to added sound to DB');
    }
    return {};
  }
}
