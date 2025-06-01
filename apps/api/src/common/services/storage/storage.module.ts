import { ConfigModule } from '@nestjs/config';
import { AmazonS3Service } from './AmazonS3Service';
import { Module, DynamicModule } from '@nestjs/common';
import { STORAGE_SERVICE, StorageConfig } from './storage.config';

@Module({})
export class StorageModule {
  static register(config: StorageConfig): DynamicModule {
    let service = AmazonS3Service;
    switch (config.type) {
      case 's3':
        service = AmazonS3Service;
        break;
      case 'disk':
        throw new Error('Disk storage is not implemented');
    }
    return {
      module: StorageModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: STORAGE_SERVICE,
          useClass: service,
        },
      ],
      exports: [STORAGE_SERVICE],
    };
  }
}
