import { LoginRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto implements LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
