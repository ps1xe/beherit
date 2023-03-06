import { GetUrlSoundResponse } from '@beherit/grpc/protobufs/user.pb';

export class GetUrlToDownloadResponseDto implements GetUrlSoundResponse {
  url: string;
}
