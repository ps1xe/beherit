import { RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

export class ValidateExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    return throwError(() => {
      if (exception.message == 'Token is invalid') {
        return { error: 'Token is invalid', userId: null };
      } else if (exception.message == 'User not found') {
        return { error: 'User not found', userId: null };
      }
    });
  }
}
