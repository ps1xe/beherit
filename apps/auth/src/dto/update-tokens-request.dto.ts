import { UpdateTokensRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateTokensRequestDto implements UpdateTokensRequest {
  @Type(() => String)
  @IsString()
  refreshToken: string;
}
