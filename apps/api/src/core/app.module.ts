import { Module } from '@nestjs/common';
import { BrandsModule } from '../modules/brands/brands.module';
import { InterceptorsProvider } from './interceptors/interceptors.provider';

@Module({
  imports: [BrandsModule],
  controllers: [],
  providers: [...InterceptorsProvider],
})
export class AppModule {}
