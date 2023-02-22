import { UploadSoundRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { IsUUID } from 'class-validator';

export class UploadSoundDto implements UploadSoundRequest {
  buffer!: Buffer;

  @IsUUID()
  userId!: string;
}
