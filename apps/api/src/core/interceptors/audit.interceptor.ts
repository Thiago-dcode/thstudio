import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const device = context.switchToHttp().getRequest().headers['user-agent'];
    const ip = context.switchToHttp().getRequest().ip();
    return next.handle().pipe(
      map((data) => ({
        data,
        audit: {
          device,
          ip,
          timestamp: new Date().toISOString(),
          duration: `${Date.now() - now}ms`,
        },
      })),
    );
  }
}
