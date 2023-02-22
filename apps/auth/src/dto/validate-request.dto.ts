import { ValidateRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsString } from 'class-validator';

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  token!: string;
}
