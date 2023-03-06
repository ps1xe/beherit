import { PartialUser } from '@beherit/grpc/protobufs/user.pb';
import { Type } from 'class-transformer';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class SaveDto implements PartialUser {
  @Type(() => String)
  @IsUUID()
  id?: string;

  @Type(() => String)
  @IsString()
  username: string;

  @Type(() => String)
  @IsEmail()
  email: string;

  @Type(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Type(() => String)
  @IsString()
  avatar: string;

  @Type(() => String)
  @IsString()
  refreshToken: string;

  @Type(() => String)
  @IsString()
  recoveryToken: string;
}
