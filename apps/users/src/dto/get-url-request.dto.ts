import { GetUrlSoundRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsUUID } from 'class-validator';

export class GetUrlToDownloadRequestDto implements GetUrlSoundRequest {
  @IsUUID()
  soundId!: string;
}
