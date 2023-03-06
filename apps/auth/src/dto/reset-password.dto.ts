import { ResetPasswordRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto implements ResetPasswordRequest {
  @Type(() => String)
  @IsString()
  token: string;

  @Type(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
