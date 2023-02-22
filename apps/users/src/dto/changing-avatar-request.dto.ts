import { ChangingAvatarRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsString, IsUUID } from 'class-validator';

export class ChangingAvatarRequestDto implements ChangingAvatarRequest {
  @IsUUID()
  userId!: string;

  avatar!: Buffer;

  @IsString()
  extension: string;
}
