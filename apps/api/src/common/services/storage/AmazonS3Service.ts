import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '@common/services/storage/StorageService';
import { StorageUploadException } from './exceptions/StorageUploadException';
import { StorageGetException } from './exceptions/StorageGetException';

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
    this.bucketName = configService.getOrThrow('AWS_S3_BUCKET_NAME');
    this.signedUrlExpiration =
      configService.get<number>('AWS_S3_SIGNED_URL_EXPIRATION') || 180;
    this.s3Client = new S3Client({
      region: configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_S3_ACCESS_KEY'),
        secretAccessKey: configService.getOrThrow('AWS_S3_SECRET_KEY'),
      },
    });
  }
  async getFile(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.signedUrlExpiration,
      });
      return url;
    } catch (error) {
      throw new StorageGetException(error);
    }
  }

  async uploadFile(file: Express.Multer.File, fileName?: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName || file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    try {
      const result = await this.s3Client.send(command);
      return !!result;
    } catch (error) {
      throw new StorageUploadException(error);
    }
  }

  async uploadAndGetFile(file: Express.Multer.File, fileName?: string) {
    const result = await this.uploadFile(file, fileName);
    if (!result) {
      throw new StorageUploadException('Failed to upload file');
    }
    return this.getFile(fileName || file.originalname);
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}
