import { GetListSoundsRequest } from '@beherit/grpc/protobufs/user.pb';
import { IsUUID } from 'class-validator';
import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';

export class GetListSoundsRequsetDto implements GetListSoundsRequest {
  @IsUUID()
  userId!: string;

  pageOptions: PageOptionsDto;
}
