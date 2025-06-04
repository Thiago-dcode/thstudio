import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestService } from '@common/services/request/request.service';
import { PrismaService } from '@common/services/db/prisma.service';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(
    private readonly requestService: RequestService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { lan } = req.query;
    if (lan && typeof lan === 'string') {
      const language = await this.prisma.language.findUnique({
        where: {
          code: lan,
        },
      });
      this.requestService.language = language;
    }

    next();
  }
}
