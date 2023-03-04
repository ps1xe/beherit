import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { config } from '@beherit/config';
import { s3 } from '../s3-connection.js';
import { Repository } from 'typeorm';
import { Void } from '@beherit/grpc/protobufs/sounds.pb';
import { RpcException } from '@nestjs/microservices';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { PageDto } from '@beherit/common/pagination/dto/PageDto';
import { PageMetaDto } from '@beherit/common/pagination/dto/PageMetaDto';

@Injectable()
export class SoundsService implements OnModuleInit {
  private soundRepository: Repository<Sound>;

  onModuleInit(): void {
    this.soundRepository = typeorm.getRepository(Sound);
  }

  //----------------------------------------------------------------
  async findOne(soundId: string): Promise<Sound | undefined> {
    const sound = this.soundRepository.findOne({ where: { id: soundId } });

    if (!sound) {
      return undefined;
    }

    return sound;
  }

  //----------------------------------------------------------------
  async find(
    pageOptionsDto: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<Sound>> {
    const queryBuilder = this.soundRepository.createQueryBuilder('sound');

    queryBuilder
      .where('sound.userId = :userId', { userId: userId })
      .orderBy('sound.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
