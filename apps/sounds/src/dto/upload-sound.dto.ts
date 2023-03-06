import { UploadSoundRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class UploadSoundDto implements UploadSoundRequest {
  buffer: Buffer;

  @Type(() => String)
  @IsUUID()
  userId: string;
}
