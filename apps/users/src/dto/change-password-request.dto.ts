import { ChangePasswordRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters long' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters long' })
  newPassword!: string;
}
