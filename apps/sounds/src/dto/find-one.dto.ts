import { FindOneRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { IsUUID } from 'class-validator';

export class FindOneDto implements FindOneRequest {
  @IsUUID()
  soundId: string;
}
