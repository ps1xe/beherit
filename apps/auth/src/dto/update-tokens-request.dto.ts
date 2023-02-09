import { IsString } from 'class-validator';

export class UpdateTokensRequestDto {
  @IsString()
  refreshToken: string;
}
