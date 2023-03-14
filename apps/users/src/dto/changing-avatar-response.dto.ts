import { ChangingAvatarResponse } from '@beherit/grpc/protobufs/user.pb';

export class ChangingAvatarResponseDto implements ChangingAvatarResponse {
  url: string;
}
