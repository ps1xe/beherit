import { GetUrlSoundRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetUrlToDownloadRequestDto implements GetUrlSoundRequest {
  @Type(() => String)
  @IsUUID()
  soundId: string;
}
