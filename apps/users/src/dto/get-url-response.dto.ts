import { GetUrlSoundResponse } from '@beherit/grpc/protobufs/user.pb';
import { IsUrl } from 'class-validator';

export class GetUrlToDownloadResponseDto implements GetUrlSoundResponse {
  url!: string;
}
