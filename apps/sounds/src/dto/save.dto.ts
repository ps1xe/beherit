import { SaveRequest } from '@beherit/grpc/protobufs/sounds.pb';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, IsBoolean } from 'class-validator';

export class SaveDto implements SaveRequest {
  @Type(() => String)
  readonly id?: string;

  @Type(() => String)
  @IsString()
  readonly name: string;

  @Type(() => String)
  @IsString()
  readonly key: string;

  @Type(() => String)
  @IsUUID()
  readonly userId: string;

  @Type(() => String)
  @IsString()
  readonly genre: string = 'Rock';

  @Type(() => Number)
  @IsNumber()
  readonly length: number;

  @Type(() => Boolean)
  @IsBoolean()
  readonly loaded: boolean;
}
