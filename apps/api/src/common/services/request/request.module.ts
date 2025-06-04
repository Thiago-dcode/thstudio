import { Global, Module } from '@nestjs/common';
import { RequestService } from './request.service';

@Global()
@Module({
  exports: [RequestService],
  providers: [RequestService],
})
export class RequestModule {}
