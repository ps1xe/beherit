import { GetUserProfileResponse } from '@beherit/grpc/protobufs/user.pb';

export class GetUserProfileResponseDto implements GetUserProfileResponse {
  email: string;
  username: string;
  avatar: string;
}
