import { GetLinkToResetPasswordRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsEmail } from 'class-validator';

export class GetLinkToResetPasswordRequestDto
  implements GetLinkToResetPasswordRequest
{
  @IsEmail()
  email!: string;
}
