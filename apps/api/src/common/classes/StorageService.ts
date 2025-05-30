import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';


@Injectable()
export abstract class StorageService {
  constructor(protected readonly configService: ConfigService) {}
  abstract getFile(pathToFile: string): Promise<string>;
  abstract uploadFile(
    file: Buffer,
    fileName: string,
    contentType?: string,
  ): Promise<boolean>;
  abstract deleteFile(pathToFile: string): Promise<boolean>;
}
