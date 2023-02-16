import { IsEmail, IsString } from 'class-validator';

export class RestorePasswordRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
