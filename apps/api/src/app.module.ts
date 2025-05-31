import { Module } from '@nestjs/common';
import { BrandsModule } from '@modules/brands/brands.module';
import { InterceptorsProvider } from '@common/interceptors/interceptor.providers';
import { PrismaService } from '@common/services/db/PrismaService';
import { MediaModule } from '@modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
import { PipesProvider } from '@common/pipes/pipe.providers';
import { ValidatorProviders } from '@common/validators/validator.providers';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BrandsModule,
    MediaModule,
  ],
  controllers: [],
  providers: [
    ...InterceptorsProvider,
    ...PipesProvider,
    ...ValidatorProviders,
    PrismaService,
  ],
})
export class AppModule {}
