// src/prisma/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Scope,
} from '@nestjs/common';
import { PrismaClient } from '@database/generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
 
  async onModuleInit() {
   
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
