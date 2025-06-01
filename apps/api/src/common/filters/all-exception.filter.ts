import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const environment = this.configService.get('NODE_ENV');
    const stack =
      environment === 'development' ||
      environment === 'test' ||
      environment === 'local' ||
      environment === 'dev'
        ? exception.stack
        : undefined;
    this.logger.error(
      `${request.method} ${request.url} ${status} ${exception} ${environment}`,
    );
    const responseBody = {
      timestamp: new Date().toISOString(),
      message: [
        {
          property: 'serverError',
          message: 'Internal server error',
        },
      ],
      statusCode: status,
      error: 'Internal server error',
      stack,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
