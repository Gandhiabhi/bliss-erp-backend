import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If response already follows structure
        if (res && typeof res === 'object' && 'success' in res) {
          return res;
        }

        // If response has data and meta (paginated)
        if (res && typeof res === 'object' && 'meta' in res && 'data' in res) {
          return {
            success: true,
            data: res.data,
            meta: res.meta,
            message: res.message || 'Success',
          };
        }

        return {
          success: true,
          data: res,
          message: 'Success',
        };
      })
    );
  }
}
