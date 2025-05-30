import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AmazonS3Service } from 'common/services/AmazonS3Service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.getOrThrow('THROTTLE_TTL'),
            limit: configService.getOrThrow('THROTTLE_LIMIT'),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    AmazonS3Service,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class MediaModule {}
