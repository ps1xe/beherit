import { IsUUID } from 'class-validator';

export class UploadSoundDto {
  dataBuffer: Buffer;

  // @IsUUID()
  // userId: string;
}
