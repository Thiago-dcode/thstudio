import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestService } from '@common/services/request/request.service';
import { PrismaService } from '@common/services/db/prisma.service';
import { EnumLanguage } from '@database/generated/prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const LANGUAGE_HEADER = 'x-app-lan';
const DEFAULT_LANGUAGE_KEY = 'defaultLanguage';
@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LanguageMiddleware.name);
  constructor(
    private readonly requestService: RequestService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { lan } = req.query;
    //Priority 1: Query Param
    let language = EnumLanguage[lan as keyof typeof EnumLanguage];
    let cachedLanguage: EnumLanguage | null = null;
    if (!language) {
      //Priority 2: custom header
      language = req.headers[LANGUAGE_HEADER] as EnumLanguage;
      if (!language) {
        //Priority 3: accept-language header
        const acceptLanguage = req.headers['accept-language'];

        if (acceptLanguage) {
          const primaryLanguage = acceptLanguage
            .split(',')[0]
            .split('-')[0]
            .toUpperCase();
          language = EnumLanguage[primaryLanguage as keyof typeof EnumLanguage];
        }
        if (!language) {
          //Priority 5: cache
          cachedLanguage = await this.cacheManager.get(DEFAULT_LANGUAGE_KEY);
          if (!cachedLanguage) {
            //Priority 6: default language from database (slow operation)
            const defaultLanguage = await this.prisma.language.findFirst({
              where: {
                isDefault: true,
              },
            });
            language = defaultLanguage?.code;
          }
        }
      }
      //Fallback in case no language is found(should never happen)
      if (!language) language = EnumLanguage.ES;

      //Avoid storing the same language again
      if (!cachedLanguage || cachedLanguage !== language) {
        await this.cacheManager.set(
          DEFAULT_LANGUAGE_KEY,
          language,
          60 * 60 * 24 * 30,
        );
      }
      res.setHeader(LANGUAGE_HEADER, language);
      this.requestService.language = language;

      next();
    }
  }
}
