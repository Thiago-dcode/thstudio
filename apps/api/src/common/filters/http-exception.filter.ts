import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseMessage = exception.getResponse();
    const environment = this.configService.get('NODE_ENV');
    this.logger.error(
      `${request.method} ${request.url} ${status} ${responseMessage} ${environment}`,
    );
    const stack =
      environment === 'development' ||
      environment === 'test' ||
      environment === 'local' ||
      environment === 'dev'
        ? exception.stack
        : undefined;

    if (typeof responseMessage === 'object') {
      if (
        responseMessage['message'] &&
        Array.isArray(responseMessage['message'])
      ) {
        response.status(status).json({
          ...responseMessage,
          stack: stack,
        });
      } else {
        console.log('responseMessage', responseMessage);
        response.status(status).json({
          ...responseMessage,
          message: [
            {
              property: exception.name,
              message: responseMessage['message'],
            },
          ],
          error: responseMessage['error'] || exception.message,
          stack: stack,
        });
      }
    } else {
      response.status(status).json({
        statusCode: status,
        message: [
          {
            property: exception.name,
            message: responseMessage,
          },
        ],
        error: exception.message,
        stack: stack,
      });
    }
  }
}
