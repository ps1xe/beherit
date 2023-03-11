import { Injectable, OnModuleInit } from '@nestjs/common';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { PageDto } from '@beherit/common/pagination/dto/PageDto';
import { PageMetaDto } from '@beherit/common/pagination/dto/PageMetaDto';
import { status } from '@grpc/grpc-js';

@Injectable()
export class SoundsService implements OnModuleInit {
  private soundRepository: Repository<Sound>;

  onModuleInit(): void {
    this.soundRepository = typeorm.getRepository(Sound);
  }

  //----------------------------------------------------------------
  async findOne(soundId: string): Promise<Sound | undefined> {
    try {
      const sound = this.soundRepository.findOne({ where: { id: soundId } });

      if (!sound) {
        return undefined;
      }

      return sound;
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

      queryBuilder
        .where('sound.userId = :userId', { userId: userId })
        .orderBy('sound.createdAt', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take);

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
}
