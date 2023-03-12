import { SaveResponse, Sound } from '@beherit/grpc/protobufs/sounds.pb';

export class SaveResponseDto implements SaveResponse {
  data: Sound;
}
