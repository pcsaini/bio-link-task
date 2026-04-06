import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        if (result && result.body && result.statusCode !== undefined) {
          const response = context.switchToHttp().getResponse();
          response.status(result.statusCode);

          if (result.headers) {
            for (const [key, value] of Object.entries(result.headers)) {
              response.setHeader(key, value as string);
            }
          }

          return result.body;
        }
        return result;
      }),
    );
  }
}
