import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { EnumMediaShape, EnumMediaType } from '@database/generated/prisma';
import { imageSize } from 'image-size';
import sharp from 'sharp';

@Injectable()
export abstract class StorageService {
  constructor(protected readonly configService: ConfigService) {}
  abstract getFile(pathToFile: string): Promise<string>;
  abstract uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<boolean>;
  abstract uploadAndGetFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<string>;
  abstract deleteFile(pathToFile: string): Promise<boolean>;

  public async optimizeImageToWebp(
    file: Express.Multer.File,
    quality: number = 90,
    targetSize: number = 2 * 1024 * 1024,
  ): Promise<Buffer> {
    //avoid min of 100kb
    const _targetSize = targetSize < 100 * 1024 ? 100 * 1024 : targetSize;
    if (!file.mimetype.startsWith('image/') || file.size < _targetSize)
      return file.buffer;

    const optimizeRecursively = async (
      buffer: Buffer,
      quality: number,
      targetSize: number,
      loops = 0,
    ) => {
      const { width, height } = imageSize(buffer);
      //avoid quality out of range
      const _quality = quality > 100 ? 100 : quality < 10 ? 10 : quality;
      //reduce the image size by 10% each time
      const reduce = 0.9;
      const targetWidth = Math.floor(width * reduce);
      const targetHeight = Math.floor(height * reduce);
      const optimizedBuffer = await sharp(file.buffer)
        .resize({
          width: targetWidth,
          height: targetHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: _quality })
        .toBuffer();

      if (optimizedBuffer.length < targetSize || loops > 5)
        return optimizedBuffer;
      return await optimizeRecursively(
        optimizedBuffer,
        _quality - 5,
        targetSize,
        loops + 1,
      );
    };
    return await optimizeRecursively(file.buffer, quality, _targetSize);
  }

  public getType(file: Express.Multer.File): EnumMediaType | undefined {
    if (file.mimetype.startsWith('image/')) {
      return EnumMediaType.IMAGE;
    }
    if (file.mimetype.startsWith('video/')) {
      return EnumMediaType.VIDEO;
    }
    return undefined;
  }
  public getShape(file: Express.Multer.File): EnumMediaShape | undefined {
    if (file.mimetype.startsWith('image/')) {
      const size = imageSize(file.buffer);
      const ratio = size.width / size.height;

      if (size.width > size.height) {
        return ratio >= 1.5
          ? EnumMediaShape.LANDSCAPE_LARGE
          : EnumMediaShape.LANDSCAPE;
      } else if (size.width < size.height) {
        return ratio <= 0.67
          ? EnumMediaShape.PORTRAIT_LARGE
          : EnumMediaShape.PORTRAIT;
      }
      return EnumMediaShape.SQUARE;
    }
    return undefined;
  }
}
