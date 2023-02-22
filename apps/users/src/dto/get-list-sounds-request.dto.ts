import { GetListSoundsRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsUUID } from 'class-validator';

export class GetListSoundsRequsetDto implements GetListSoundsRequest {
  @IsUUID()
  userId!: string;
}
