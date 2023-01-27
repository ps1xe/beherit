import { Inject, Injectable } from '@nestjs/common';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  ValidateResponse,
} from '@beherit/grpc/protobufs/auth.pb';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private svc: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async validate(token: string): Promise<ValidateResponse> {
    return firstValueFrom(this.svc.validate({ token }));
  }
}
