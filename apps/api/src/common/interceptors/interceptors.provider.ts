import { Provider } from '@nestjs/common';
import { AuditInterceptor } from './audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

export const InterceptorsProvider: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: AuditInterceptor,
  },
];
