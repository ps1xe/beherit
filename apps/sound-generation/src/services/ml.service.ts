import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  SoundsServiceClient,
  SOUNDS_SERVICE_NAME,
} from '@beherit/grpc/protobufs/sounds.pb';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator.js';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
} from '@beherit/grpc/protobufs/user.pb';
import { Void } from '@beherit/grpc/protobufs/sound-generation.pb';
import { randomUUID } from 'crypto';

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
    name: string,
    genre: string,
    length: number,
    userId: string,
  ): Promise<Void> {
    const newSound = await lastValueFrom(
      this.svcSounds.save({
        key: '',
        genre: genre,
        name: name,
        length: length,
        userId: userId,
        loaded: false,
      }),
    );

    const len = Math.round(length / 0.256);
    const pyLogs = await execSync(
      `python ..\\sound-generation\\src\\algoritm\\generate.py ${genre} ${len}`,
    );

    const linesLogs = pyLogs.toString().split('\r');

    const key = linesLogs[linesLogs.length - 2];

    const sound = await lastValueFrom(
      this.svcSounds.save({
        ...newSound.data,
        key: key.toString().trim(),
        loaded: true,
      }),
    );

    return {};
  }
}
