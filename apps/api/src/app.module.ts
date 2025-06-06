import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { InterceptorsProvider } from '@common/interceptors/interceptor.providers';
import { MediaModule } from '@modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
import { PipesProvider } from '@common/pipes/pipe.providers';
import { ValidatorProviders } from '@common/validators/validator.providers';
import { AuthenticationMiddleware } from '@common/middlewares/authentication.middleware';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { PrismaModule } from '@common/services/db/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from '@common/filters/all-exception.filter';
import { RequestModule } from '@common/services/request/request.module';
import { LanguageMiddleware } from '@common/middlewares/language.middleware';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationIdMiddleware } from '@common/middlewares/correlation-id/correlation-id.middleware';
import { Request } from 'express';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                },
              }
            : undefined,
        messageKey: 'message',
        autoLogging: false,
        serializers: {
          req(req: Request) {
            return undefined;
          },
          res() {
            return undefined;
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    MediaModule,
    AuthenticationModule,
    PrismaModule,
    RequestModule,
  ],
  controllers: [],
  providers: [
    ...InterceptorsProvider,
    ...PipesProvider,
    ...ValidatorProviders,

    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        {
          path: '*',
          method: RequestMethod.GET,
        },
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
    consumer.apply(LanguageMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
