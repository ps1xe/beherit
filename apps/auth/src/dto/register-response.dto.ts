import { RegisterResponse } from '@beherit/grpc/protobufs/auth.pb';

export class RegisterResponseDto implements RegisterResponse {
  refreshToken: string;

  token: string;
}
