import { ValidateRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class ValidateRequestDto implements ValidateRequest {
  @Type(() => String)
  @IsString()
  token: string;
}
