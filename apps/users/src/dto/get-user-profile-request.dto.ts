import { GetUserProfileRequest } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetUserProfileRequestDto implements GetUserProfileRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;
}
