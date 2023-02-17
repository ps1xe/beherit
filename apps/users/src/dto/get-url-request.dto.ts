import { IsUUID } from 'class-validator';

export class GetUrlToDownloadRequestDto {
  @IsUUID()
  soundId: string;
}
