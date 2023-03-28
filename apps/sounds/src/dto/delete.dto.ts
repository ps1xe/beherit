import { DeleteRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class DeleteDto implements DeleteRequest {
  @Type(() => String)
  @IsUUID()
  soundId: string;
}
