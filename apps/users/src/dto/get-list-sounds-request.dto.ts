import { GetListSoundsRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsUUID } from 'class-validator';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { Type } from 'class-transformer';

export class GetListSoundsRequsetDto implements GetListSoundsRequest {
  @Type(() => String)
  @IsUUID()
  userId: string;

  pageOptions: PageOptionsDto;
}
