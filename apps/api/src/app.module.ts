import { Module } from '@nestjs/common';
import { BrandsModule } from './modules/brands/brands.module';
import { InterceptorsProvider } from 'common/interceptors/interceptors.provider';
import { PrismaService } from 'common/services/PrismaService';

@Module({
  imports: [BrandsModule],
  controllers: [],
  providers: [...InterceptorsProvider,PrismaService],
})
export class AppModule {}
