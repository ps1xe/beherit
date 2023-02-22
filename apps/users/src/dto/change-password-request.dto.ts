import { ChangePasswordRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsString, IsUUID } from 'class-validator';

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @IsUUID()
  userId!: string;

  @IsString()
  currentPassword!: string;

  @IsString()
  newPassword!: string;
}
