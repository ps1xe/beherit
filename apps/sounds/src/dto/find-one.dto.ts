import { FindOneRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class FindOneDto implements FindOneRequest {
  @Type(() => String)
  @IsUUID()
  soundId: string;
}
