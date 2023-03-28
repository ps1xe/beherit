import { VerificationRecoveryTokenRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class VerificationRecoveryToken
  implements VerificationRecoveryTokenRequest
{
  @Type(() => String)
  @IsString()
  token: string;
}
