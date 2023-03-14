import {
  GetUrlSoundResponse,
  SoundInfo,
} from '@beherit/grpc/protobufs/user.pb';

export class GetUrlToDownloadResponseDto implements GetUrlSoundResponse {
  soundInfo: SoundInfo;
  url: string;
}
