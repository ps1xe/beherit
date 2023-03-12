import { Inject, Injectable } from '@nestjs/common';
import { typeorm } from '../typeorm-connection.js';
import { config } from '@beherit/config';
import { GetUrlToDownloadResponseDto } from '../dto/get-url-response.dto.js';
import { Repository } from 'typeorm';
import { s3 } from '@beherit/common/s3/s3-connection';
import { OnModuleInit } from '@nestjs/common/interfaces/index.js';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { GetListSoundsResponseDto } from '../dto/get-list-sounds-response.dto.js';
import { Void } from '@beherit/grpc/protobufs/user.pb';
import { SaveDto } from '../dto/save.dto.js';
import { User, User as UserEntity } from '@beherit/typeorm/entities/User';
import { lastValueFrom } from 'rxjs';
import {
  PageOptionsDto,
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { status } from '@grpc/grpc-js';
import { GetAvatarResponseDto } from '../dto/get-avatar-response.dto.js';

@Injectable()
export class UsersService implements OnModuleInit {
  private svc: SoundsServiceClient;
  private userRepository: Repository<UserEntity>;

  constructor(
    @Inject(SOUNDS_SERVICE_NAME)
    private readonly soundsClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.svc =
      this.soundsClient.getService<SoundsServiceClient>(SOUNDS_SERVICE_NAME);
    this.userRepository = typeorm.getRepository(UserEntity);
  }

  //----------------------------------------------------------------
  async findOne(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      if (!user) {
        return undefined;
      }

      return user;
    } catch (exception) {
      throw new RpcException({
        message: 'DB read error',
        code: status.INTERNAL,
      });
    }
  }

  //----------------------------------------------------------------
  async save(user: SaveDto): Promise<User> {
    try {
      return this.userRepository.save(user);
    } catch (exception) {
      throw new RpcException({
        message: 'DB write error',
        code: status.INTERNAL,
      });
    }
  }

  //----------------------------------------------------------------
  async getUrlToDownloadSound(
    soundId: string,
  ): Promise<GetUrlToDownloadResponseDto> {
    const sound = await lastValueFrom(this.svc.findOne({ soundId }));

    if (!sound.data) {
      throw new RpcException({
        message: 'Sound not found',
        code: status.NOT_FOUND,
      });
    }

    const key = sound.data.key;
    console.log(`;${key};`);

    const paramsForUrl = {
      Bucket: config.S3_BUCKET_NAME_SOUNDS,
      Expires: 5000,
      Key: key,
    };

    const url = await s3.getSignedUrlPromise('getObject', paramsForUrl);

    return { url };
  }

  //----------------------------------------------------------------
  async getListSounds(
    pageOptions: PageOptionsDto,
    userId: string,
  ): Promise<GetListSoundsResponseDto> {
    const findSounds = await lastValueFrom(
      this.svc.find({ pageOptions, userId }),
    );

    if (!findSounds.sounds) {
      return { sounds: [], meta: findSounds.meta };
    }

    const sounds_ids = findSounds.sounds.map((sound) => {
      return sound.id;
    });

    const urls = [];

    for (const id of sounds_ids) {
      const getUrlObject = await this.getUrlToDownloadSound(id);
      urls.push(getUrlObject.url);
    }

    return { sounds: urls, meta: findSounds.meta };
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
      throw new RpcException({
        message: `Failed to update user: ${exception}`,
        code: status.INTERNAL,
      });
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
      throw new RpcException({
        message: 'User not found',
        code: status.NOT_FOUND,
      });
    }

    const isPasswordValid = await bcrypt.compareSync(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new RpcException({
        message: 'Password wrong',
        code: status.UNAUTHENTICATED,
      });
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
      throw new RpcException({
        message: `Failed to update user: ${exception}`,
        code: status.INTERNAL,
      });
    }

    return {};
  }

  async getAvatar(email: string): Promise<GetAvatarResponseDto> {
    const user = await this.userRepository.findOne({ where: { email: email } });

    const paramsForUrl = {
      Bucket: config.S3_BUCKET_NAME_AVATAR,
      Expires: 5000,
      Key: user.avatar,
    };

    const url = await s3.getSignedUrlPromise('getObject', paramsForUrl);

    return { url };
  }
}
