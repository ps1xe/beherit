import { IsUUID } from 'class-validator';

export class UploadSoundDto {
  buffer: Buffer;

  @IsUUID()
  userId: string;
}
