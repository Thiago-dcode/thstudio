import { Module } from '@nestjs/common';
import { LanguageMiddleware } from './language.middleware';

@Module({
  providers: [LanguageMiddleware],
})
export class LanguageMiddlewareModule {}
