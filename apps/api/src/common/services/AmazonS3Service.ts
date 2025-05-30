import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from 'common/classes/StorageService';

@Injectable()
export class AmazonS3Service extends StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private signedUrlExpiration: number;
  constructor(configService: ConfigService) {
    super(configService);
    this.setup(configService);
  }

  private setup(configService: ConfigService) {
    this.bucketName = configService.getOrThrow('S3_BUCKET_NAME');
    this.signedUrlExpiration =
      configService.get<number>('S3_SIGNED_URL_EXPIRATION') || 180;
    this.s3Client = new S3Client({
      region: configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
  async getFile(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.signedUrlExpiration,
    });
    return url;
  }

  async uploadFile(file: Buffer, fileName: string, contentType?: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
    return true;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    return true;
  }
}
