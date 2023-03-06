import { FindOneRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class findOneDto implements FindOneRequest {
  @Type(() => String)
  @IsEmail()
  email: string;
}
