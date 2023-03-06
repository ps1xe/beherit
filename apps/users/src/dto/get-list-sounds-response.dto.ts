import { GetListSoundsResponse } from '@beherit/grpc/protobufs/user.pb';
import { PageMetaDto } from '@beherit/common/pagination/dto/PageMetaDto';

export class GetListSoundsResponseDto implements GetListSoundsResponse {
  sounds: string[];

  meta: PageMetaDto;
}
