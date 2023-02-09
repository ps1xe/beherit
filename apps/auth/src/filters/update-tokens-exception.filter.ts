import { RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

export class UpdateTokensExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    return throwError(() => {
      if (exception.message == 'User not found') {
        return { error: 'User not found', token: null, refreshToken: null };
      } else if (exception.message == 'Refresh token invalid') {
        return {
          error: 'Refresh token invalid',
          token: null,
          refreshToken: null,
        };
      }
    });
  }
}
