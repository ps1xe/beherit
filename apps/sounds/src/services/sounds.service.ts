import { Injectable, OnModuleInit } from '@nestjs/common';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { PageDto } from '@beherit/common/pagination/dto/PageDto';
import { PageMetaDto } from '@beherit/common/pagination/dto/PageMetaDto';
import { status } from '@grpc/grpc-js';
import {
  FindOneResponse,
  SaveResponse,
  Void,
} from '@beherit/grpc/protobufs/sounds.pb';
import { config } from '@beherit/config';
import { s3 } from '@beherit/common/s3/s3-connection';

@Injectable()
export class SoundsService implements OnModuleInit {
  private soundRepository: Repository<Sound>;

  onModuleInit(): void {
    this.soundRepository = typeorm.getRepository(Sound);
  }

  //----------------------------------------------------------------
  async findOne(soundId: string): Promise<FindOneResponse> {
    try {
      const sound = await this.soundRepository.findOne({
        where: { id: soundId },
      });

      if (!sound) {
        return undefined;
      }

      return { data: sound };
    } catch (exception) {
      throw new RpcException({
        message: 'DB read error',
        code: status.INTERNAL,
      });
    }
  }

  //----------------------------------------------------------------
  async find(
    pageOptionsDto: PageOptionsDto,
    userId: string,
  ): Promise<PageDto<Sound>> {
    try {
      const queryBuilder = this.soundRepository.createQueryBuilder('sound');

      const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;

      queryBuilder
        .where('sound.userId = :userId', { userId: userId })
        .orderBy('sound.createdAt', pageOptionsDto.order)
        .take(pageOptionsDto.take)
        .skip(skip);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(entities, pageMetaDto);
    } catch (exception) {
      throw new RpcException({
        message: 'DB read error',
        code: status.INTERNAL,
      });
    }
  }

  //----------------------------------------------------------------
  async save(
    name: string,
    key: string,
    userId: string,
    genre: string,
    length: number,
    loaded: boolean,
    id: string,
  ): Promise<SaveResponse> {
    try {
      const newSound = {
        id: id,
        name: name,
        key: key,
        userId: userId,
        genre: genre,
        length: length,
        loaded: loaded,
      } as Sound;

      const sound = await this.soundRepository.save(newSound);

      return { data: sound };
    } catch (exception) {
      console.log(exception);
      throw new RpcException({
        message: 'DB write error',
        code: status.INTERNAL,
      });
    }
  }

  //----------------------------------------------------------------
  async deleteSound(soundId: string): Promise<Void> {
    try {
      const sound = await this.soundRepository.findOne({
        where: { id: soundId },
      });
      if (sound.key !== '') {
        const paramsForDelete = {
          Bucket: config.S3_BUCKET_NAME_SOUNDS,
          Key: sound.key,
        };

        s3.deleteObject(paramsForDelete);
      }
      this.soundRepository.delete({ id: soundId });

      return {};
    } catch (exception) {
      new RpcException({
        message: 'Deletion error',
        code: status.INTERNAL,
      });
    }
  }
}
