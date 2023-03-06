import { ValidateResponse } from '@beherit/grpc/protobufs/auth.pb';

export class ValidateResponseDto implements ValidateResponse {
  userId: string;
}
