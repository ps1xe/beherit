import { LoginResponse, UserInfo } from '@beherit/grpc/protobufs/auth.pb';

export class LoginResponseDto implements LoginResponse {
  token: string;

  refreshToken: string;

  userInfo: UserInfo;
}
