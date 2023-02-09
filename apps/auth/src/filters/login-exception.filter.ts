import { RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

export class LoginExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException): Observable<any> {
    return throwError(() => {
      if (exception.message == 'Email not found') {
        return { error: 'Email not found', token: null, refreshToken: null };
      } else if (exception.message == 'Password wrong') {
        return { error: 'Password wrong', token: null, refreshToken: null };
      }
    });
  }
}
