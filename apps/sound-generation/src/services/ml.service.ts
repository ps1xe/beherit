import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator.js';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { execSync } from 'child_process';
import { GenerateResponse } from '@beherit/grpc/protobufs/sound-generation.pb';
import { promises as fs } from 'fs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';

@Injectable()
export class MlService implements OnModuleInit {
  private svcSounds: SoundsServiceClient;
  private svcUsers: UserServiceClient;

  constructor(
    @Inject(SOUNDS_SERVICE_NAME)
    private readonly soundsClient: ClientGrpc,
    @Inject(USER_SERVICE_NAME)
    private readonly usersClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.svcSounds =
      this.soundsClient.getService<SoundsServiceClient>(SOUNDS_SERVICE_NAME);
    this.svcUsers =
      this.usersClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async generate(
    genre: string,
    length: number,
    userId: string,
  ): Promise<GenerateResponse> {
    const key = execSync(
      `python ..\\sound-generation\\src\\algoritm\\generate-sound.py ${genre} ${length}`,
    );

    const sound = await lastValueFrom(
      this.svcSounds.save({
        key: key.toString().trim(),
        genre: genre,
        length: length,
        userId: userId,
      }),
    );

    const soundId = sound.data.id;

    const url = await lastValueFrom(
      this.svcUsers.getUrlToDownloadSound({ soundId }),
    );

    try {
      fs.unlink(
        '..\\sound-generation\\src\\algoritm\\generated\\tmp\\generated-output.mid',
      );
    } catch (exception) {
      console.log('Temporary midi file not found!');
    }

    return url;
  }
}
