import { GetAvatarRequset } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class GetAvatarRequestDto implements GetAvatarRequset {
  @Type(() => String)
  @IsEmail()
  email: string;
}
