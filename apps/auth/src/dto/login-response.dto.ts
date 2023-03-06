import { LoginResponse } from '@beherit/grpc/protobufs/auth.pb';

export class LoginResponseDto implements LoginResponse {
  token: string;

  refreshToken: string;
}
