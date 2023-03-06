import { ChangePasswordRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordRequestDto implements ChangePasswordRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;

  @Type(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  currentPassword: string;

  @Type(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
