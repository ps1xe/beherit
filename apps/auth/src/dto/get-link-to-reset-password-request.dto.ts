import { GetLinkToResetPasswordRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class GetLinkToResetPasswordRequestDto
  implements GetLinkToResetPasswordRequest
{
  @Type(() => String)
  @IsEmail()
  email: string;
}
