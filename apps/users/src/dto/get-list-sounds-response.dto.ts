import {
  GetListSoundsResponse,
  SoundInfo,
} from '@beherit/grpc/protobufs/user.pb';
import { PageMetaDto } from '@beherit/common/pagination/dto/PageMetaDto';

export class GetListSoundsResponseDto implements GetListSoundsResponse {
  soundsInfo: SoundInfo[];

  sounds: string[];

  meta: PageMetaDto;
}
