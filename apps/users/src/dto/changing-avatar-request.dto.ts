import { ChangingAvatarRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class ChangingAvatarRequestDto implements ChangingAvatarRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;

  avatar: Buffer;

  @Type(() => String)
  @IsString()
  extension: string;
}
