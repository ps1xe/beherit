import { FindRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { IsUUID } from 'class-validator';
export class FindDto implements FindRequest {
  @IsUUID()
  userId: string;
}
