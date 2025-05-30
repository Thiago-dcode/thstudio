import { Module } from '@nestjs/common';
import { BrandsModule } from './modules/brands/brands.module';
import { InterceptorsProvider } from 'common/interceptors/interceptors.provider';
import { PrismaService } from 'common/services/PrismaService';
import { MediaModule } from './modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BrandsModule,
    MediaModule,
  ],
  controllers: [],
  providers: [...InterceptorsProvider, PrismaService],
})
export class AppModule {}
