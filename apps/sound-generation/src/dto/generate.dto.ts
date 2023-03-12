import { GenerateRequest } from '@beherit/grpc/protobufs/sound-generation.pb';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class GenerateDto implements GenerateRequest {
  @Type(() => String)
  @IsString()
  genre: string;

  @Type(() => Number)
  @IsNumber()
  length: number;

  @Type(() => String)
  @IsUUID()
  userId: string;
}
