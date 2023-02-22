import { GetListSoundsResponse } from '@beherit/grpc/protobufs/user.pb';

export class GetListSoundsResponseDto implements GetListSoundsResponse {
  sounds!: string[];
}
