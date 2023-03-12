import { GetAvatarResponse } from '@beherit/grpc/protobufs/user.pb';

export class GetAvatarResponseDto implements GetAvatarResponse {
  url: string;
}
