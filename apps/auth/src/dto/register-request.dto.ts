import { RegisterRequest } from '@beherit/grpc/protobufs/auth.pb';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequestDto implements RegisterRequest {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
