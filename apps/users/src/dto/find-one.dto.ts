import { FindOneRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsEmail } from 'class-validator';

export class findOneDto implements FindOneRequest {
  @IsEmail()
  email!: string;
}
