import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AmazonS3Service } from './AmazonS3Service';
import { S3Client } from '@aws-sdk/client-s3';
import { StorageUploadException } from './exceptions/StorageUploadException';
import { StorageGetException } from './exceptions/StorageGetException';

// Definición de tipos para Express.Multer.File
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('AmazonS3Service', () => {
  let service: AmazonS3Service;
  let configService: ConfigService;
  let mockS3Client: jest.Mocked<S3Client>;

  const mockConfig = {
    getOrThrow: jest.fn((key: string) => {
      const config = {
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_TEST_BUCKET_NAME,
        AWS_S3_REGION: process.env.AWS_S3_REGION,
        AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
        AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
      };
      return config[key];
    }),
    get: jest.fn((key: string) => {
      const config = {
        AWS_S3_SIGNED_URL_EXPIRATION: 180,
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmazonS3Service,
        {
          provide: ConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<AmazonS3Service>(AmazonS3Service);
    configService = module.get<ConfigService>(ConfigService);
    mockS3Client = S3Client.prototype as jest.Mocked<S3Client>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFileBuffer', () => {
    it('should return file buffer', async () => {
      const mockBuffer = Buffer.from('test data');
      mockS3Client.send = jest.fn().mockResolvedValue({
        Body: {
          transformToByteArray: jest.fn().mockResolvedValue(mockBuffer),
        },
      });

      const result = await service.getFileBuffer('test-file.txt');
      expect(result).toBeInstanceOf(Buffer);
      expect(result).toEqual(mockBuffer);
    });
  });

  describe('getFile', () => {
    it('should return signed URL', async () => {
      const mockUrl = 'https://test-bucket.s3.amazonaws.com/test-file.txt';
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue(mockUrl);

      const result = await service.getFile('test-file.txt');
      expect(result).toBe(mockUrl);
    });

    it('should throw StorageGetException on error', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockRejectedValue(new Error('Test error'));

      await expect(service.getFile('test-file.txt')).rejects.toThrow(
        StorageGetException,
      );
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const mockFile = {
        buffer: Buffer.from('test data'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      mockS3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.uploadFile(mockFile);
      expect(result).toBe(true);
    });

    it('should throw StorageUploadException on error', async () => {
      const mockFile = {
        buffer: Buffer.from('test data'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      mockS3Client.send = jest.fn().mockRejectedValue(new Error('Test error'));

      await expect(service.uploadFile(mockFile)).rejects.toThrow(
        StorageUploadException,
      );
    });
  });

  describe('uploadAndGetFile', () => {
    it('should upload file and return signed URL', async () => {
      const mockFile = {
        buffer: Buffer.from('test data'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      const mockUrl = 'https://test-bucket.s3.amazonaws.com/test.txt';
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue(mockUrl);

      mockS3Client.send = jest.fn().mockResolvedValue({});

      const result = await service.uploadAndGetFile(mockFile);
      expect(result).toBe(mockUrl);
    });
  });

  describe('deleteFile', () => {
    it('should throw error as not implemented', async () => {
      await expect(service.deleteFile('test-url')).rejects.toThrow(
        'Not implemented',
      );
    });
  });
});
