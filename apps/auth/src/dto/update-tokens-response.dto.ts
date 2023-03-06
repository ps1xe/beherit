import { UpdateTokensResponse } from '@beherit/grpc/protobufs/auth.pb';

export class UpdateTokensResponseDto implements UpdateTokensResponse {
  token: string;

  refreshToken: string;
}
