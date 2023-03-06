import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { FindRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
export class FindDto implements FindRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;

  pageOptions: PageOptionsDto;
}
