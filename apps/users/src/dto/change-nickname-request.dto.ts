import { ChangeNicknameRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class ChangeNicknameRequestDto implements ChangeNicknameRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;

  @Type(() => String)
  @IsString()
  newNickname: string;
}
