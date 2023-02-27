import { ResetPasswordRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto implements ResetPasswordRequest {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
