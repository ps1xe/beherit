import { RegisterRequest } from '@beherit/grpc/protobufs/auth.pb';
import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto implements RegisterRequest {
  @Type(() => String)
  @IsEmail()
  email: string;

  @Type(() => String)
  @IsString()
  username: string;

  @Type(() => String)
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
