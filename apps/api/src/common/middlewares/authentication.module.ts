import { Module } from '@nestjs/common';
import { AuthenticationMiddleware } from './authentication.middleware';
import { RequestService } from '@common/services/request/request.service';

@Module({
  providers: [AuthenticationMiddleware, RequestService],
  exports: [AuthenticationMiddleware],
})
export class AuthenticationMiddlewareModule {} 