import { PageOptionsDto } from '@beherit/common/pagination/dto/PageOptionsDto';
import { FindRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { IsUUID } from 'class-validator';
export class FindDto {
  // implements FindRequest
  @IsUUID()
  userId: string;

  pageOptions: PageOptionsDto;
}
