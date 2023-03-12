import {
  UpdateTokensResponse,
  UserInfo,
} from '@beherit/grpc/protobufs/auth.pb';

export class UpdateTokensResponseDto implements UpdateTokensResponse {
  token: string;

  refreshToken: string;

  userInfo: UserInfo;
}
