import { Injectable } from '@nestjs/common';
import { typeorm } from '../typeorm-connection.js';
import { Sound } from '@beherit/typeorm/entities/Sound';
import { User } from '@beherit/typeorm/entities/User';
import { config } from '@beherit/config';
import { GetUrlToDownloadResponseDto } from '../dto/get-url-response.dto.js';
import { Repository } from 'typeorm';
import { s3 } from '../s3-connection.js';
import { OnModuleInit } from '@nestjs/common/interfaces/index.js';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { GetListSoundsResponseDto } from '../dto/get-list-sounds-response.dto.js';
import { Void } from '@beherit/grpc/protobufs/user.pb';

@Injectable()
export class UsersService implements OnModuleInit {
  private soundRepository: Repository<Sound>;
  private userRepository: Repository<User>;

  onModuleInit(): void {
    this.soundRepository = typeorm.getRepository(Sound);
    this.userRepository = typeorm.getRepository(User);
  }

  //----------------------------------------------------------------
  async getUrlToDownloadSound(
    soundId: string,
  ): Promise<GetUrlToDownloadResponseDto> {
    const sound = await this.soundRepository.findOne({
      where: {
        id: soundId,
      },
    });

    if (!sound) {
      throw new RpcException('Sound not found');
    }

    const paramsForUrl = {
      Bucket: config.S3_BUCKET_NAME_SOUNDS,
      Expires: 5000,
      Key: sound.key,
    };

    const url = await s3.getSignedUrlPromise('getObject', paramsForUrl);

    return { url };
  }

  //----------------------------------------------------------------
  async getListSounds(userId: string): Promise<GetListSoundsResponseDto> {
    const sounds = await this.soundRepository.find({
      where: {
        userId: userId,
      },
    });

    const sounds_ids = sounds.map((sound) => {
      return sound.id;
    });

    const urls = [];

    for (const id of sounds_ids) {
      const getUrlObject = await this.getUrlToDownloadSound(id);
      urls.push(getUrlObject.url);
    }

    return { sounds: urls };
  }

  //----------------------------------------------------------------
  async changingAvatar(
    userId: string,
    avatar: Buffer,
    extension: string,
  ): Promise<Void> {
    const uploadResult = await s3
      .upload({
        Bucket: config.S3_BUCKET_NAME_AVATAR,
        Body: avatar,
        Key: `${uuid() + '.' + extension}`,
      })
      .promise();

    const avatarStorageInDB = {
      avatar: uploadResult.Key,
      userId: userId,
    };

    try {
      this.userRepository.save(avatarStorageInDB);
    } catch (exception) {
      throw new RpcException(`Failed to update user: ${exception}`);
    }
    return {};
  }

  //----------------------------------------------------------------
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<Void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new RpcException('User not found');
    }

    const isPasswordValid = await bcrypt.compareSync(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new RpcException('Password wrong');
    }

    const salt = await bcrypt.genSalt(5);
    const encodeNewPassword = await bcrypt.hashSync(newPassword, salt);

    const updateUserPasswordObject = {
      id: userId,
      password: encodeNewPassword,
    };

    try {
      this.userRepository.save(updateUserPasswordObject);
    } catch (exception) {
      throw new RpcException(`Failed to update user: ${exception}`);
    }

    return {};
  }
}
