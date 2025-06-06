import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { StorageModule } from '@common/services/storage/storage.module';
import { MediaHelper } from './media.helper';

@Module({
  imports: [StorageModule.register({ type: 's3' })],
  controllers: [MediaController],
  providers: [MediaService, MediaHelper],
})
export class MediaModule {}
