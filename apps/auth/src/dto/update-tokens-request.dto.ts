import { UpdateTokensRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsString } from 'class-validator';

export class UpdateTokensRequestDto implements UpdateTokensRequest {
  @IsString()
  refreshToken!: string;
}
