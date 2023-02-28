import { PartialUser } from '@beherit/grpc/protobufs/user.pb';

export class SaveDto implements PartialUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
  recoveryToken: string;
}
